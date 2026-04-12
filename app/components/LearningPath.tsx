const PATH_NODES = [
  {
    step: 1,
    label: "Install VS Code",
    tag: "Setup",
    href: "/guide",
    circleColor: "bg-blue-600",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    step: 2,
    label: "Add Claude Code",
    tag: "Setup",
    href: "/guide",
    circleColor: "bg-blue-600",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    step: 3,
    label: "First Conversation",
    tag: "Beginner",
    href: "/guide",
    circleColor: "bg-green-600",
    tagColor: "bg-green-100 text-green-700",
  },
  {
    step: 4,
    label: "Slash Commands",
    tag: "Beginner",
    href: "/guide",
    circleColor: "bg-green-600",
    tagColor: "bg-green-100 text-green-700",
  },
  {
    step: 5,
    label: "Inline Edits",
    tag: "Intermediate",
    href: "/guide",
    circleColor: "bg-yellow-500",
    tagColor: "bg-yellow-100 text-yellow-700",
  },
  {
    step: 6,
    label: "MCP & Agents",
    tag: "Advanced",
    href: "/guide",
    circleColor: "bg-red-500",
    tagColor: "bg-red-100 text-red-700",
  },
];

export default function LearningPath() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      {/* Desktop: horizontal row */}
      <div className="hidden sm:flex items-start justify-between gap-2">
        {PATH_NODES.map((node, i) => (
          <div key={node.step} className="flex items-start flex-1">
            {/* Node */}
            <a href={node.href} className="flex flex-col items-center text-center group flex-1">
              <div
                className={`w-10 h-10 rounded-full ${node.circleColor} text-white font-bold text-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}
              >
                {node.step}
              </div>
              <p className="text-xs font-semibold text-gray-800 leading-tight mb-1.5">
                {node.label}
              </p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${node.tagColor}`}>
                {node.tag}
              </span>
            </a>

            {/* Connector line between nodes */}
            {i < PATH_NODES.length - 1 && (
              <div className="mt-5 flex-shrink-0 w-4 border-t-2 border-dashed border-gray-300" />
            )}
          </div>
        ))}
      </div>

      {/* Mobile: vertical stack */}
      <div className="flex flex-col gap-3 sm:hidden">
        {PATH_NODES.map((node, i) => (
          <div key={node.step}>
            <a href={node.href} className="flex items-center gap-3 group">
              <div
                className={`w-9 h-9 rounded-full ${node.circleColor} text-white font-bold text-sm flex items-center justify-center flex-shrink-0`}
              >
                {node.step}
              </div>
              <div className="flex-1 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {node.label}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${node.tagColor}`}>
                  {node.tag}
                </span>
              </div>
            </a>
            {i < PATH_NODES.length - 1 && (
              <div className="ml-4 mt-1 w-0.5 h-3 border-l-2 border-dashed border-gray-300" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
