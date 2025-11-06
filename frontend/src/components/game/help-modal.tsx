'use client'

import { useMemo } from 'react'
import ReactFlow, {
  Background,
  Controls,
  type Edge,
  type Node,
  MarkerType,
  Position,
  BaseEdge,
  EdgeProps,
} from 'reactflow'
import dagre from 'dagre'
import 'reactflow/dist/style.css'

import type { Config, HelpItem, Phase } from '../../types'
import { formatKeys } from '../../utils/keybinds'

interface HelpModalProps {
  showHelp: boolean
  config: Config
  setShowHelp: (show: boolean) => void
}

interface PhaseDiagramProps {
  phases: Phase[]
  nextPhaseKeybind?: string[]
}

const nodeWidth = 140
const nodeHeight = 140 // Make it square for circles

// Custom self-loop edge component
const SelfLoopEdge = ({ id, sourceX, sourceY, style, markerEnd, label, labelStyle, labelBgStyle }: EdgeProps) => {
  // Create a curved loop path that goes up and around
  const radius = 50
  const offsetX = nodeWidth / 2 + 10
  
  // Create a smooth loop: start from right side, curve up and around, back to start
  const path = `M ${sourceX + offsetX} ${sourceY} 
                C ${sourceX + offsetX + radius} ${sourceY - radius * 0.5}, 
                  ${sourceX + offsetX + radius} ${sourceY - radius * 1.5}, 
                  ${sourceX + offsetX} ${sourceY - radius * 2}
                C ${sourceX + offsetX - radius} ${sourceY - radius * 1.5}, 
                  ${sourceX + offsetX - radius} ${sourceY - radius * 0.5}, 
                  ${sourceX + offsetX} ${sourceY}`
  
  const labelX = sourceX + offsetX
  const labelY = sourceY - radius * 1.5
  const labelText = typeof label === 'string' ? label : String(label || '')
  const labelWidth = labelText.length * 8 + 20

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        style={style}
        markerEnd={markerEnd}
      />
      {labelText && (
        <g transform={`translate(${labelX}, ${labelY})`}>
          <rect
            x={-labelWidth / 2}
            y={-8}
            width={labelWidth}
            height={16}
            fill={labelBgStyle?.fill || 'white'}
            fillOpacity={labelBgStyle?.fillOpacity || 0.95}
            stroke={labelBgStyle?.stroke || '#3b82f6'}
            strokeWidth={labelBgStyle?.strokeWidth || 1}
            rx={4}
          />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            style={labelStyle}
          >
            {labelText}
          </text>
        </g>
      )}
    </>
  )
}

const edgeTypes = {
  selfloop: SelfLoopEdge,
}

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  // Use compound: false to allow cycles, and set acyclic: false
  dagreGraph.setGraph({ 
    rankdir: direction, 
    nodesep: 100, 
    ranksep: 150,
    acyclicer: undefined, // Allow cycles
  })

  nodes.forEach((node) => {
    // Use diameter for circular nodes
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })

  // Only add non-self-loop edges to dagre (self-loops are positioned manually)
  edges.forEach((edge) => {
    if (edge.source !== edge.target) {
      dagreGraph.setEdge(edge.source, edge.target)
    }
  })

  dagre.layout(dagreGraph)

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    node.targetPosition = Position.Left
    node.sourcePosition = Position.Right
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    }
  })

  // Position self-loops manually
  edges.forEach((edge) => {
    if (edge.source === edge.target) {
      const node = nodes.find((n) => n.id === edge.source)
      if (node) {
        // Position self-loop edge relative to node
        edge.sourceHandle = 'right'
        edge.targetHandle = 'right'
      }
    }
  })

  return { nodes, edges }
}

const PhaseDiagram = ({ phases, nextPhaseKeybind }: PhaseDiagramProps) => {
  const { nodes, edges } = useMemo(() => {
    if (!phases || phases.length === 0) {
      return { nodes: [], edges: [] }
    }

    // Create nodes without positions (dagre will calculate them)
    const flowNodes: Node[] = phases.map((phase, index) => {
      const hasDirectKeybind = phase.keybind && phase.keybind.length > 0
      const isStartNode = index === 0

      return {
        id: `phase-${index}`,
        type: 'default',
        position: { x: 0, y: 0 }, // Will be calculated by dagre
        data: {
          label: (
            <div className="flex flex-col items-center justify-center gap-1 p-3 h-full">
              {isStartNode && (
                <div className="mb-1 rounded-full bg-blue-100 px-2 py-0.5 text-blue-700 text-xs font-bold">
                  START
                </div>
              )}
              <div className="font-semibold text-gray-900 text-sm text-center leading-tight">
                {phase.name}
              </div>
              <div className="text-gray-500 text-xs">#{index}</div>
              {hasDirectKeybind && (
                <div className="mt-1 font-medium text-green-600 text-xs">
                  {formatKeys(phase.keybind!)}
                </div>
              )}
            </div>
          ),
        },
        style: {
          width: nodeWidth,
          height: nodeHeight,
          border: hasDirectKeybind 
            ? '3px solid #10b981' 
            : isStartNode 
              ? '3px solid #3b82f6' 
              : '2px solid #6b7280',
          borderRadius: '50%', // Make it circular
          backgroundColor: isStartNode ? '#eff6ff' : 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      }
    })

    // Create edges - only create valid edges
    const flowEdges: Edge[] = []
    phases.forEach((phase, index) => {
      // Skip if next is undefined or invalid
      if (phase.next === undefined || phase.next < 0) return
      
      // If next is 0 and this is not the Start phase (index 0), treat as end state with self-loop
      // If next equals index, it's explicitly a self-loop
      // Otherwise, follow the normal transition
      const isEndState = (phase.next === 0 && index !== 0) || phase.next === index
      const targetIndex = isEndState ? index : phase.next
      
      // Validate target index
      if (targetIndex < 0 || targetIndex >= phases.length) return
      
      // Skip self-loops that aren't end states (shouldn't happen, but safety check)
      if (targetIndex === index && !isEndState) return

      const keybindLabel = nextPhaseKeybind ? formatKeys(nextPhaseKeybind) : ''
      const isSelfLoop = targetIndex === index

      flowEdges.push({
        id: `edge-${index}-${targetIndex}`,
        source: `phase-${index}`,
        target: `phase-${targetIndex}`,
        type: isSelfLoop ? 'selfloop' : 'smoothstep',
        animated: false,
        label: keybindLabel,
        labelStyle: {
          fill: '#3b82f6',
          fontWeight: 600,
          fontSize: '12px',
        },
        labelBgStyle: {
          fill: 'white',
          fillOpacity: 0.95,
          stroke: '#3b82f6',
          strokeWidth: 1,
        },
        style: {
          stroke: '#3b82f6',
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#3b82f6',
          width: 20,
          height: 20,
        },
      })
    })

    // Apply dagre layout
    return getLayoutedElements(flowNodes, flowEdges)
  }, [phases, nextPhaseKeybind])

  if (!phases || phases.length === 0) return null

  return (
    <div className="mt-8">
      <h3 className="mb-4 font-semibold text-lg text-gray-900">Phase State Diagram</h3>
      <div className="rounded-lg bg-gray-50 p-4" style={{ height: '600px', minHeight: '400px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 50, maxZoom: 1.5 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={true}
          zoomOnScroll={true}
          zoomOnPinch={true}
          minZoom={0.3}
          maxZoom={2}
        >
          <Background gap={20} size={1} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <p>
          <span className="font-semibold">Blue circle with "START":</span> The initial phase where the game begins
        </p>
        <p>
          <span className="font-semibold">Green border:</span> Phase has a direct keybind (shown on the phase) to jump directly to it
        </p>
        <p>
          <span className="font-semibold">Arrows:</span> Show the flow from one phase to the next
        </p>
        {nextPhaseKeybind && (
          <p>
            <span className="font-semibold">Arrow labels:</span> Show the keybind{' '}
            <kbd className="rounded bg-gray-200 px-2 py-1 font-mono text-xs">
              {formatKeys(nextPhaseKeybind)}
            </kbd>{' '}
            to advance to the next phase
          </p>
        )}
        <p>
          <span className="font-semibold">Self-loops:</span> End states that loop back to themselves
        </p>
      </div>
    </div>
  )
}

const getHelpText = (config: Config): HelpItem[] => {
  if (!config || !config.keybinds) return []

  const { keybinds } = config
  const help: HelpItem[] = []

  if (keybinds.nextPhase) {
    help.push({ label: 'Advance to next phase', keys: formatKeys(keybinds.nextPhase) })
  }

  // Phases with keybinds
  if (config.phases) {
    config.phases.forEach((phase) => {
      if (phase.keybind && phase.keybind.length > 0) {
        help.push({ label: `Jump to ${phase.name}`, keys: formatKeys(phase.keybind) })
      }
    })
  }

  // SFX with keybinds
  if (config.sfx) {
    config.sfx.forEach((sfx, index) => {
      if (sfx.keybind && sfx.keybind.length > 0) {
        help.push({ label: `SFX ${index + 1}`, keys: formatKeys(sfx.keybind) })
      }
    })
  }

  if (keybinds.mute) {
    help.push({ label: 'Toggle mute', keys: formatKeys(keybinds.mute) })
  }
  if (keybinds.help) {
    help.push({ label: 'Toggle this help', keys: formatKeys(keybinds.help) })
  }

  return help
}

export const HelpModal = ({ showHelp, config, setShowHelp }: HelpModalProps) => {
  if (!showHelp) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowHelp(false)
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || (e.key === 'Enter' && e.target === e.currentTarget)) {
          setShowHelp(false)
        }
      }}
    >
      <div className="w-full max-w-2xl rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-8 flex items-center justify-between">
          <h2 id="help-modal-title" className="font-bold text-3xl text-gray-900">
            Keyboard Shortcuts
          </h2>
          <button
            type="button"
            onClick={() => setShowHelp(false)}
            aria-label="Close"
            className="rounded-lg p-2 text-2xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            ×
          </button>
        </div>

        <div className="space-y-2">
          {getHelpText(config).map((item) => (
            <div
              key={`${item.keys}-${item.label}`}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-5 py-3 transition-colors hover:bg-gray-100"
            >
              <span className="font-medium text-gray-900">{item.label}</span>
              <div className="flex gap-2">
                {item.keys.split('/').map((key) => (
                  <kbd
                    key={key}
                    className="rounded-md bg-gray-200 px-3 py-1.5 font-mono font-semibold text-gray-800 text-sm shadow-sm"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        {config.phases && config.phases.length > 0 && (
          <PhaseDiagram
            phases={config.phases}
            nextPhaseKeybind={config.keybinds?.nextPhase}
          />
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Press{' '}
            <kbd className="rounded bg-gray-200 px-2 py-1 font-mono font-semibold text-gray-800 text-xs">
              ESC
            </kbd>{' '}
            to close
          </p>
        </div>
      </div>
    </div>
  )
}
