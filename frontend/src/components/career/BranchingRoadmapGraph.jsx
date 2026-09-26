import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  Background,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { HorizontalSkillNode } from './HorizontalSkillNode';
import { TargetCareerNode } from './TargetCareerNode';
import { SkillDetailsDrawer } from './SkillDetailsDrawer';
import { BACKEND_DEVELOPER_ROADMAP } from '../../data/mock/horizontalRoadmapData';
import { useTheme } from '../../context/ThemeContext';
import {
  Filter,
  Navigation,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Award,
  ChevronRight,
  Info
} from 'lucide-react';
import { Button } from '../ui/Button';

const nodeTypes = {
  horizontalSkillNode: HorizontalSkillNode,
  targetCareerNode: TargetCareerNode
};

const RoadmapGraphContent = ({ initialData }) => {
  const { isDark } = useTheme();
  const { setCenter, fitView } = useReactFlow();

  const [nodes, setNodes] = useState(initialData?.nodes || BACKEND_DEVELOPER_ROADMAP.nodes);
  const [edges, setEdges] = useState(initialData?.edges || BACKEND_DEVELOPER_ROADMAP.edges);

  useEffect(() => {
    if (initialData?.nodes && initialData.nodes.length > 0) {
      setNodes(initialData.nodes);
    }
    if (initialData?.edges) {
      setEdges(initialData.edges);
    }
    setSelectedNode(null);
    setDrawerOpen(false);
    setTimeout(() => {
      try {
        fitView({ padding: 0.2, duration: 400 });
      } catch (e) {}
    }, 150);
  }, [initialData, fitView]);

  const [selectedNode, setSelectedNode] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [justProgressed, setJustProgressed] = useState(false);

  // Derive dynamic stats from current nodes
  const stats = useMemo(() => {
    let verified = 0;
    let partial = 0;
    let missing = 0;

    nodes.forEach((n) => {
      if (n.type === 'targetCareerNode') return;
      if (n.data.status === 'verified') verified++;
      else if (n.data.status === 'partial') partial++;
      else missing++;
    });

    return { verified, partial, missing, total: verified + partial + missing };
  }, [nodes]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // Click on a node opens right detail drawer
  const handleNodeClick = (event, node) => {
    setSelectedNode(node);
    setDrawerOpen(true);
  };

  // Button 1: [My Progress] - Pushes view to the latest in-progress / verified boundary
  const handleMoveToProgress = () => {
    // Center on REST APIs / Backend Architecture node
    setCenter(800, 260, { zoom: 0.9, duration: 800 });
  };

  // Button 2: [Recommended Next] - Centers directly onto the active recommended next node
  const handleMoveToRecommended = () => {
    const recommended = nodes.find((n) => n.data.isRecommendedNext);
    if (recommended) {
      setCenter(recommended.position.x + 100, recommended.position.y + 50, { zoom: 1.15, duration: 800 });
      setSelectedNode(recommended);
      setDrawerOpen(true);
    }
  };

  // Dynamic Skill Verification & Progress Animation Workflow
  const handleVerifySkill = (nodeId) => {
    setJustProgressed(true);

    // 1. Update node status to 'verified'
    let nextRecommendedId = null;

    setNodes((prevNodes) => {
      const updated = prevNodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              status: 'verified',
              isRecommendedNext: false,
              currentLevel: node.data.requiredLevel,
              score: 91
            }
          };
        }
        return node;
      });

      // Find the next unverified node to assign Recommended Next highlight
      const nextUnverified = updated.find(
        (n) => n.type !== 'targetCareerNode' && n.data.status !== 'verified' && n.id !== nodeId
      );

      if (nextUnverified) {
        nextRecommendedId = nextUnverified.id;
        return updated.map((n) => {
          if (n.id === nextRecommendedId) {
            return {
              ...n,
              data: {
                ...n.data,
                isRecommendedNext: true
              }
            };
          }
          return n;
        });
      }

      // If all skills verified, update milestone node
      return updated.map((n) => {
        if (n.type === 'targetCareerNode') {
          return {
            ...n,
            data: {
              ...n.data,
              verifiedSkillsCount: 11,
              isCompleted: true
            }
          };
        }
        return n;
      });
    });

    // 2. Activate connecting edges: green stroke, animated particle dash
    setEdges((prevEdges) =>
      prevEdges.map((edge) => {
        if (edge.source === nodeId) {
          return {
            ...edge,
            animated: true,
            style: {
              stroke: '#10b981',
              strokeWidth: 3
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#10b981',
              width: 18,
              height: 18
            }
          };
        }
        return edge;
      })
    );

    // Update open drawer state
    setTimeout(() => {
      setSelectedNode((prev) => {
        if (prev?.id === nodeId) {
          return {
            ...prev,
            data: {
              ...prev.data,
              status: 'verified',
              isRecommendedNext: false,
              currentLevel: prev.data.requiredLevel,
              score: 91
            }
          };
        }
        return prev;
      });
    }, 100);

    // Center on the new connection
    setTimeout(() => {
      setJustProgressed(false);
    }, 2500);
  };

  return (
    <div className="space-y-4">
      {/* 1. PROGRESS HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-[var(--border-line)] bg-[var(--card-surface)] shadow-sm font-editorial-mono">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent-terracotta)]">
              Horizontal Career Competency Pathway
            </span>
            {justProgressed && (
              <span className="bg-emerald-500 text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase animate-pulse">
                ✓ Progress Recorded
              </span>
            )}
          </div>
          <h2 className="font-editorial-title text-xl sm:text-2xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
            {initialData?.roleTitle || 'Career Pathway'}
          </h2>

          {/* Counts: 🟢 5 Verified  🟡 3 Partial  🔴 4 Not Verified */}
          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              🟢 {stats.verified} Verified
            </span>
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              🟡 {stats.partial} Partial
            </span>
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              🔴 {stats.missing} Not Verified
            </span>
          </div>
        </div>

        {/* Action Controls: [My Progress] & [Recommended Next] */}
        <div className="flex items-center gap-3">
          <Button
            size="md"
            variant="outline"
            onClick={handleMoveToProgress}
            iconLeft={Navigation}
            className="text-xs font-bold font-editorial-mono"
          >
            My Progress
          </Button>

          <Button
            size="md"
            variant="primary"
            onClick={handleMoveToRecommended}
            iconLeft={Sparkles}
            className="text-xs font-bold font-editorial-mono bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            Recommended Next
          </Button>
        </div>
      </div>

      {/* 2. EXPANSIVE HORIZONTAL CANVAS */}
      <div className="relative w-full h-[680px] rounded-xl border border-[var(--border-line)] bg-[var(--card-surface)] overflow-hidden shadow-md">
        {/* Left -> Right Directional Guide Watermark */}
        <div className="absolute top-4 left-6 z-10 flex items-center gap-2 text-xs font-editorial-mono opacity-50 pointer-events-none">
          <span>FOUNDATIONS</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>CORE STACK</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>MICROSERVICES & CONTAINERS</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>TARGET CAREER</span>
        </div>

        {/* React Flow Component */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onPaneClick={() => setDrawerOpen(false)}
          defaultViewport={{ x: 50, y: 80, zoom: 0.8 }}
          minZoom={0.3}
          maxZoom={1.5}
          attributionPosition="bottom-left"
        >
          <Controls
            showInteractive={false}
            className="!border !border-current/20 !bg-[var(--card-surface)] !shadow-md !rounded-lg !overflow-hidden font-editorial-mono"
          />
          <Background
            color={isDark ? '#2e2b28' : '#d8d1c4'}
            gap={28}
            size={1}
          />
          <MiniMap
            nodeStrokeWidth={3}
            zoomable
            pannable
            className="!border !border-current/20 !bg-[var(--card-surface)] !rounded-lg !shadow-sm"
            nodeColor={(n) => {
              if (n.type === 'targetCareerNode') return '#d97736';
              if (n.data?.status === 'verified') return '#10b981';
              if (n.data?.status === 'partial') return '#f59e0b';
              return '#ef4444';
            }}
          />
        </ReactFlow>

        {/* Bottom Helper Bar */}
        <div className="absolute bottom-4 left-6 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-current/15 bg-[var(--card-surface)]/90 backdrop-blur-md font-editorial-mono text-[11px] opacity-70 pointer-events-none">
          <Info className="h-3.5 w-3.5 text-[var(--accent-terracotta)]" />
          <span>Scroll horizontally or click & drag to travel from Left to Right along the career path.</span>
        </div>
      </div>

      {/* 3. RIGHT-SIDE DETAIL DRAWER (Graph remains visible behind) */}
      {drawerOpen && selectedNode && selectedNode.type !== 'targetCareerNode' && (
        <SkillDetailsDrawer
          skillNode={selectedNode}
          onClose={() => setDrawerOpen(false)}
          onVerifySkill={handleVerifySkill}
        />
      )}
    </div>
  );
};

export const BranchingRoadmapGraph = ({ graphData }) => {
  return (
    <ReactFlowProvider>
      <RoadmapGraphContent initialData={graphData} />
    </ReactFlowProvider>
  );
};
