'use client'

import dagre from 'dagre'
import { useMemo } from 'react'
import ReactFlow, {
  Background,
  BaseEdge,
  Controls,
  type Edge,
  type EdgeProps,
  MarkerType,
  type Node,
  Position,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { X } from 'lucide-react'

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
const SelfLoopEdge = ({
  id,
  sourceX,
  sourceY,
  style,
  markerEnd,
  label,
  labelStyle,
  labelBgStyle,
}: EdgeProps) => {
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
      <BaseEdge id={id} path={path} style={style} markerEnd={markerEnd} />
      {labelText && (
        <g transform={`translate(${labelX}, ${labelY})`}>
          <rect
            x={-labelWidth / 2}
            y={-8}
            width={labelWidth}
            height={16}
            fill={labelBgStyle?.fill || 'rgba(20, 20, 20, 0.8)'}
            fillOpacity={labelBgStyle?.fillOpacity || 0.95}
            stroke={labelBgStyle?.stroke || 'rgba(255, 255, 255, 0.1)'}
            strokeWidth={labelBgStyle?.strokeWidth || 1}
            rx={4}
          />
          <text textAnchor="middle" dominantBaseline="middle" style={labelStyle}>
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
            <div className="flex h-full flex-col items-center justify-center gap-1 p-3">
              {isStartNode && (
                <div className="mb-1 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(20,20,20,0.4)] px-2 py-0.5 font-light text-[#e5e5e5] text-xs opacity-60">
                  START
                </div>
              )}
              <div className="text-center font-light text-[#e5e5e5] text-sm leading-tight opacity-80">
                {phase.name}
              </div>
              <div className="text-[#e5e5e5] text-xs opacity-50">#{index}</div>
              {hasDirectKeybind && (
                <div className="mt-1 font-light text-[#e5e5e5] text-xs opacity-50">
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
            ? '2px solid rgba(255, 255, 255, 0.2)'
            : isStartNode
              ? '2px solid rgba(255, 255, 255, 0.15)'
              : '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '50%', // Make it circular
          backgroundColor: 'rgba(20, 20, 20, 0.6)',
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
          fill: 'rgba(229, 229, 229, 0.8)',
          fontWeight: 400,
          fontSize: '11px',
        },
        labelBgStyle: {
          fill: 'rgba(20, 20, 20, 0.8)',
          fillOpacity: 0.95,
          stroke: 'rgba(255, 255, 255, 0.1)',
          strokeWidth: 1,
        },
        style: {
          stroke: 'rgba(255, 255, 255, 0.15)',
          strokeWidth: 1.5,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'rgba(255, 255, 255, 0.15)',
          width: 18,
          height: 18,
        },
      })
    })

    // Apply dagre layout
    return getLayoutedElements(flowNodes, flowEdges)
  }, [phases, nextPhaseKeybind])

  if (!phases || phases.length === 0) return null

  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-4 font-light text-[#e5e5e5] text-sm opacity-60">Phase State Diagram</h3>
      <div className="card-clear flex-1" style={{ minHeight: '600px', height: '100%' }}>
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
          <Background gap={20} size={1} color="rgba(255, 255, 255, 0.03)" />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
      <div className="mt-4 space-y-2 text-[#e5e5e5] text-xs opacity-50">
        <p>
          <span className="font-light opacity-70">Circle with "START":</span> The initial phase
          where the game begins
        </p>
        <p>
          <span className="font-light opacity-70">Thicker border:</span> Phase has a direct keybind
          (shown on the phase) to jump directly to it
        </p>
        <p>
          <span className="font-light opacity-70">Arrows:</span> Show the flow from one phase to the
          next
        </p>
        {nextPhaseKeybind && (
          <p>
            <span className="font-light opacity-70">Arrow labels:</span> Show the keybind{' '}
            <kbd className="rounded border border-[rgba(255,255,255,0.1)] bg-[rgba(20,20,20,0.4)] px-2 py-1 font-mono text-[#e5e5e5] text-xs opacity-60">
              {formatKeys(nextPhaseKeybind)}
            </kbd>{' '}
            to advance to the next phase
          </p>
        )}
        <p>
          <span className="font-light opacity-70">Self-loops:</span> End states that loop back to
          themselves
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
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
      <div className="card-clear flex max-h-[90vh] w-full max-w-7xl flex-col rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(15,15,15,0.95)]">
        <div className="flex-shrink-0 border-[rgba(255,255,255,0.1)] border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 id="help-modal-title" className="font-light text-[#e5e5e5] text-lg opacity-90">
              Keyboard Shortcuts
            </h2>
            <button
              type="button"
              onClick={() => setShowHelp(false)}
              aria-label="Close"
              className="btn-clear"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div
            className={`grid gap-6 ${config.phases && config.phases.length > 0 ? 'grid-cols-2' : 'grid-cols-1'}`}
          >
            {/* Left column: Shortcuts table */}
            <div className="flex flex-col">
              <h3 className="mb-3 font-light text-[#e5e5e5] text-xs opacity-60">
                Keyboard Shortcuts
              </h3>
              <div className="flex-1 space-y-2">
                {getHelpText(config).map((item) => (
                  <div
                    key={`${item.keys}-${item.label}`}
                    className="card-clear flex items-center justify-between"
                  >
                    <span className="font-light text-[#e5e5e5] text-sm opacity-80">
                      {item.label}
                    </span>
                    <div className="flex gap-2">
                      {item.keys.split('/').map((key) => (
                        <kbd
                          key={key}
                          className="rounded border border-[rgba(255,255,255,0.1)] bg-[rgba(20,20,20,0.4)] px-2.5 py-1 font-light font-mono text-[#e5e5e5] text-xs opacity-70"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column: Phase diagram */}
            {config.phases && config.phases.length > 0 && (
              <div className="flex flex-col">
                <PhaseDiagram
                  phases={config.phases}
                  nextPhaseKeybind={config.keybinds?.nextPhase}
                />
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-[#e5e5e5] text-xs opacity-50">
              Press{' '}
              <kbd className="rounded border border-[rgba(255,255,255,0.1)] bg-[rgba(20,20,20,0.4)] px-2 py-1 font-light font-mono text-[#e5e5e5] text-xs opacity-70">
                ESC
              </kbd>{' '}
              to close
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
