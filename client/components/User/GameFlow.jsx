// "use client";
// import { useCallback, useState, useRef } from "react";
// import {
//   ReactFlow,
//   Controls,
//   Background,
//   useNodesState,
//   useEdgesState,
//   addEdge,
//   Connection,
//   Edge,
//   Node,
// } from "@xyflow/react";
// import "@xyflow/react/dist/style.css";
// import { Mic, MicOff, Send } from "lucide-react";
// import { AI_SERVER_URL } from "@/constants/utils"; // Make sure this path is correct or remove if not needed

// const sampleInputs = [
//   {
//     title: "Cognitive Development",
//     text: "Activities to enhance problem-solving, memory, and critical thinking.",
//   },
//   {
//     title: "Motor Skills",
//     text: "Games and exercises to improve fine and gross motor skills.",
//   },
//   {
//     title: "Emotional Well-Being",
//     text: "Activities that promote mindfulness, emotional regulation, and self-awareness.",
//   },
//   {
//     title: "Social Interaction",
//     text: "Games and activities that encourage communication, cooperation, and empathy.",
//   },
//   {
//     title: "Balanced Approach",
//     text: "A mix of activities targeting all areas of development.",
//   },
// ];

// const GameFlow = () => {
//   const [activeTab, setActiveTab] = useState("cognitive");
//   const [userInput, setUserInput] = useState("");
//   const [isListening, setIsListening] = useState(false);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [showFlowchart, setShowFlowchart] = useState(false);
//   const textareaRef = useRef(null);
//   const [serverData, setServerData] = useState(null);
//   const flowchartRef = useRef(null);

//   const [nodes, setNodes, onNodesChange] = useNodesState([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);

//   const onConnect = useCallback(
//     (params) => setEdges((eds) => addEdge(params, eds)),
//     [setEdges]
//   );

//   const handleSpeechToText = () => {
//     // Speech to text functionality - not as relevant for this use case, but kept for consistency and potential future use
//     if (!isListening) {
//       const SpeechRecognition =
//         window.SpeechRecognition || window.webkitSpeechRecognition;
//       if (SpeechRecognition) {
//         const recognition = new SpeechRecognition();
//         recognition.continuous = true;
//         recognition.interimResults = true;
//         recognition.lang = "en-IN";

//         recognition.onstart = () => {
//           setIsListening(true);
//         };

//         recognition.onresult = (event) => {
//           let transcript = "";
//           for (let i = event.resultIndex; i < event.results.length; i++) {
//             transcript += event.results[i][0].transcript;
//           }
//           setUserInput(transcript);
//           if (textareaRef.current) {
//             textareaRef.current.value = transcript;
//           }
//         };

//         recognition.onerror = (event) => {
//           console.error("Speech recognition error:", event.error);
//           setIsListening(false);
//         };

//         recognition.onend = () => {
//           setIsListening(false);
//         };

//         recognition.start();
//       } else {
//         alert("Speech recognition is not supported in your browser.");
//       }
//     } else {
//       setIsListening(false);
//       window.speechSynthesis.cancel();
//     }
//   };

//   const handleStrategySelect = (strategy) => {
//     setActiveTab(strategy);
//   };

//   const handleGenerate = async () => {
//     if (!activeTab) return;

//     setIsGenerating(true);
//     setShowFlowchart(false);

//     try {
//       const formData = new FormData();
//       formData.append(
//         "input",
//         userInput ||
//           `I am looking for games and activities to enhance ${activeTab} development.  Please generate a structured game plan that includes:

//             1. Recommended games/activities.
//             2. A brief description of each activity and its benefits.
//             3. Steps to play or engage in the activity.
//             4. Expected outcomes/skills developed.
//             5. A step-by-step game flow that visually represents key decision points and game progression.`
//       );

//       formData.append("focusArea", activeTab); // Changed 'risk' to 'focusArea' for clarity

//       // Check if AI_SERVER_URL is defined before making the request
//       if (!AI_SERVER_URL) {
//         console.error(
//           "AI_SERVER_URL is not defined. Please set it in your environment."
//         );
//         setIsGenerating(false);
//         return;
//       }

//       const response = await fetch(`${AI_SERVER_URL}/ai-game-path`, {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data && data.nodes && data.edges) {
//         setServerData(data);

//         setNodes(
//           data.nodes.map((node) => ({
//             ...node,
//             className: `
//                 ${node.style.background} !imporbluet
//                 border-2
//                 ${node.style.border} !imporbluet
//                 rounded-lg
//                 p-4
//                 text-center
//                 font-medium
//               `,
//             data: {
//               ...node.data,
//               label: node.data.label, // Removed currency replacement, not relevant here
//             },
//           }))
//         );

//         setEdges(
//           data.edges.map((edge) => ({
//             ...edge,
//             className: edge.style.stroke,
//             source: edge.source,
//             target: edge.target,
//             label: edge.label,
//           }))
//         );

//         setShowFlowchart(true);

//         setTimeout(() => {
//           flowchartRef.current?.scrollIntoView({
//             behavior: "smooth",
//             block: "start",
//           });
//         }, 100);
//       } else {
//         console.warn("Invalid server response:", data);
//         // Handle the case where the response is not in the expected format
//         // You might want to show an error message to the user
//       }
//     } catch (error) {
//       console.error("Error generating pathway:", error);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleTextareaInput = (e) => {
//     setUserInput(e.target.value);

//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto";
//       textareaRef.current.style.height =
//         textareaRef.current.scrollHeight + "px";
//     }
//   };

//   const handleSampleInput = (text) => {
//     setUserInput(text);
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto";
//       textareaRef.current.style.height =
//         textareaRef.current.scrollHeight + "px";
//     }
//   };

//   const tabs = [
//     {
//       id: "cognitive",
//       label: "Cognitive Development",
//       color: "blue",
//       description:
//         "Focuses on activities that enhance thinking skills, problem-solving, memory, and attention.",
//       benefits: [
//         "Improved problem-solving abilities",
//         "Enhanced memory and recall",
//         "Better concentration and focus",
//         "Critical thinking skills",
//       ],
//       suggestedActivities: [
//         "Puzzles (jigsaw, crossword, Sudoku)",
//         "Brain-training apps (Lumosity, Elevate)",
//         "Strategy games (Chess, Checkers)",
//         "Memory games (matching pairs)",
//       ],
//     },
//     {
//       id: "motor",
//       label: "Motor Skills",
//       color: "cream",
//       description:
//         "Focuses on activities that improve both fine and gross motor skills.",
//       benefits: [
//         "Improved coordination and balance",
//         "Enhanced dexterity and fine motor control",
//         "Better physical fitness and health",
//       ],
//       suggestedActivities: [
//         "Drawing and painting",
//         "Building with blocks or Lego",
//         "Sports (basketball, soccer, swimming)",
//         "Dancing",
//       ],
//     },
//     {
//       id: "emotional",
//       label: "Emotional Well-Being",
//       color: "teal",
//       description:
//         "Focuses on activities that promote emotional regulation, mindfulness, and self-awareness.",
//       benefits: [
//         "Reduced stress and anxiety",
//         "Improved emotional regulation",
//         "Increased self-awareness",
//         "Better overall mental health",
//       ],
//       suggestedActivities: [
//         "Mindfulness meditation",
//         "Journaling",
//         "Yoga and Tai Chi",
//         "Creative expression (art, music)",
//       ],
//     },
//     {
//       id: "social",
//       label: "Social Interaction",
//       color: "blue",
//       description:
//         "Focuses on activities that encourage communication, cooperation, and empathy.",
//       benefits: [
//         "Improved communication skills",
//         "Enhanced cooperation and teamwork",
//         "Increased empathy and undersblueding",
//         "Stronger social connections",
//       ],
//       suggestedActivities: [
//         "Board games (Monopoly, Codenames)",
//         "Team sports",
//         "Group projects and activities",
//         "Volunteering",
//       ],
//     },
//   ];

//   return (
//     <div className="mx-auto space-y-8 py-2 pr-2">
//       <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl">
//         <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
//           <div className="flex items-center mb-2">
//             <span className="text-sm font-medium text-gray-700">
//               Sample Inputs:
//             </span>
//             <span className="ml-2 text-xs text-gray-500">
//               (Click to populate)
//             </span>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {sampleInputs.map((sample, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleSampleInput(sample.text)}
//                 className="px-3 py-1.5 text-sm bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex items-center group"
//               >
//                 <span className="text-gray-600 group-hover:text-blue-600">
//                   {sample.title}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="p-6 space-y-6">
//           <div className="relative">
//             <textarea
//               ref={textareaRef}
//               value={userInput}
//               onChange={handleTextareaInput}
//               placeholder="Describe your goals for this game session, preferred activities, and any specific needs..."
//               className="w-full min-h-[120px] p-5 text-gray-800 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
//               style={{ height: "auto" }}
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => handleStrategySelect(tab.id)}
//                 className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-102 ${
//                   activeTab === tab.id
//                     ? `border-${tab.color}-500 bg-gradient-to-br from-${tab.color}-50 to-${tab.color}-100 text-${tab.color}-700 shadow-md`
//                     : "border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50"
//                 }`}
//               >
//                 <div className="font-semibold">{tab.label}</div>
//               </button>
//             ))}
//           </div>

//           {activeTab && (
//             <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
//               <h2 className="text-xl font-bold text-gray-900 mb-2">
//                 {tabs.find((tab) => tab.id === activeTab)?.label} Focus
//               </h2>
//               <p className="text-gray-600">
//                 {tabs.find((tab) => tab.id === activeTab)?.description}
//               </p>
//               <div className="mt-4">
//                 <p className="font-medium text-gray-800">
//                   Suggested Activities:
//                 </p>
//                 <ul className="list-disc pl-5 text-gray-600">
//                   {tabs
//                     .find((tab) => tab.id === activeTab)
//                     ?.suggestedActivities.map((asset, index) => (
//                       <li key={index}>{asset}</li>
//                     ))}
//                 </ul>
//               </div>
//               <div className="mt-4">
//                 <p className="font-medium text-gray-800">Benefits:</p>
//                 <ul className="list-disc pl-5 text-gray-600">
//                   {tabs
//                     .find((tab) => tab.id === activeTab)
//                     ?.benefits.map((benefit, index) => (
//                       <li key={index}>{benefit}</li>
//                     ))}
//                 </ul>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
//           <button
//             onClick={handleGenerate}
//             disabled={!activeTab || isGenerating}
//             className={`w-full flex items-center justify-center space-x-3 px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 transform hover:scale-102 ${
//               activeTab && !isGenerating
//                 ? "bg-gradient-to-tr from-blue-300 to-blue-500 hover:from-blue-400 hover:to-blue-600 text-white shadow-lg hover:shadow-xl font-semibold"
//                 : "bg-gray-100 text-gray-400 cursor-not-allowed"
//             }`}
//           >
//             <Send className="h-6 w-6" />
//             <span>
//               {isGenerating ? "Generating Game Flow..." : "Generate Game Flow"}
//             </span>
//           </button>
//         </div>
//       </div>

//       {isGenerating && (
//         <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-2xl mx-auto">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
//           <h3 className="mt-6 text-xl font-semibold text-gray-900">
//             Creating Your Personalized Game Flow
//           </h3>
//           <p className="mt-3 text-gray-600">
//             Analyzing your preferences and generating the optimal game
//             session...
//           </p>
//         </div>
//       )}

//       {showFlowchart && serverData && (
//         <div
//           ref={flowchartRef}
//           className="space-y-6 animate-fade-in scroll-mt-8"
//         >
//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//             <div className="h-[700px] w-full bg-gradient-to-br from-gray-50 to-gray-100">
//               <ReactFlow
//                 nodes={nodes}
//                 edges={edges}
//                 onNodesChange={onNodesChange}
//                 onEdgesChange={onEdgesChange}
//                 onConnect={onConnect}
//                 fitView
//                 className="bg-gray-50"
//                 defaultEdgeOptions={{
//                   type: "smoothstep",
//                   animated: true,
//                   style: { strokeWidth: 2 },
//                 }}
//               >
//                 <Background />
//                 <Controls />
//               </ReactFlow>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GameFlow;

"use client";
import { useCallback, useState, useRef } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Send } from "lucide-react";
import { AI_SERVER_URL } from "@/constants/utils"; // Make sure this path is correct

const sampleLegalInputs = [
  {
    title: "Small Claims Dispute",
    text: "I have a dispute with a contractor who didn't complete work as agreed. The amount in question is $3,500. What are my legal options?",
  },
  {
    title: "Landlord-Tenant Issue",
    text: "My landlord hasn't fixed a water leak for 3 weeks despite multiple requests. What legal steps should I take?",
  },
  {
    title: "Family Law Matter",
    text: "I'm considering filing for divorce and need to undersblued the process and timeline in my state.",
  },
  {
    title: "Employment Dispute",
    text: "I believe I was unfairly terminated from my job and want to undersblued my legal options.",
  },
  {
    title: "Personal Injury",
    text: "I was injured in a car accident that wasn't my fault. What should I do to protect my legal rights?",
  },
];

const LegalPathway = () => {
  const [activeTab, setActiveTab] = useState("litigation");
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFlowchart, setShowFlowchart] = useState(false);
  const textareaRef = useRef(null);
  const [serverData, setServerData] = useState(null);
  const flowchartRef = useRef(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleStrategySelect = (strategy) => {
    setActiveTab(strategy);
  };

  const handleTextareaInput = (e) => {
    setUserInput(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  const handleSampleInput = (text) => {
    setUserInput(text);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  const handleGenerate = async () => {
    if (!activeTab) return;

    setIsGenerating(true);
    setShowFlowchart(false);

    try {
      const formData = new FormData();
      formData.append(
        "input",
        userInput ||
          `I need guidance on a legal matter related to ${activeTab}. Please generate a structured legal pathway that includes:

            1. Recommended steps to take.
            2. Potential legal options and their pros/cons.
            3. Imporbluet timelines and deadlines.
            4. Documents needed at each stage.
            5. Alternative dispute resolution options.
            6. A step-by-step flowchart representing the legal process.`
      );

      formData.append("legalArea", activeTab);

      // Check if AI_SERVER_URL is defined before making the request
      if (!AI_SERVER_URL) {
        console.error(
          "AI_SERVER_URL is not defined. Please set it in your environment."
        );
        setIsGenerating(false);
        return;
      }

      const response = await fetch(`${AI_SERVER_URL}/ai-game-path`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.nodes && data.edges) {
        setServerData(data);

        setNodes(
          data.nodes.map((node) => ({
            ...node,
            className: `
                ${node.style.background} !imporbluet
                border-2
                ${node.style.border} !imporbluet
                rounded-lg
                p-4
                text-center
                font-medium
              `,
            data: {
              ...node.data,
              label: node.data.label,
            },
          }))
        );

        setEdges(
          data.edges.map((edge) => ({
            ...edge,
            className: edge.style.stroke,
            source: edge.source,
            target: edge.target,
            label: edge.label,
          }))
        );

        setShowFlowchart(true);

        setTimeout(() => {
          flowchartRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      } else {
        console.warn("Invalid server response:", data);
        // Handle the case where the response is not in the expected format
      }
    } catch (error) {
      console.error("Error generating pathway:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const tabs = [
    {
      id: "litigation",
      label: "Civil Litigation",
      color: "blue",
      description:
        "Traditional court process for resolving disputes through the legal system.",
      benefits: [
        "Binding decisions with legal enforcement",
        "Formal discovery process",
        "Right to appeal",
        "Public record of proceedings",
      ],
      considerations: [
        "Higher cost and longer timeline",
        "Potentially adversarial process",
        "Public nature may affect privacy",
        "Formal procedural requirements",
      ],
    },
    {
      id: "mediation",
      label: "Mediation",
      color: "green",
      description:
        "Voluntary process where a neutral third party helps parties reach a mutually acceptable solution.",
      benefits: [
        "Less expensive than litigation",
        "Usually faster resolution",
        "Confidential proceedings",
        "Parties maintain control over outcome",
      ],
      considerations: [
        "Non-binding unless agreement is reached",
        "Requires good-faith participation",
        "May not work for highly contentious disputes",
        "Less formal discovery process",
      ],
    },
    {
      id: "arbitration",
      label: "Arbitration",
      color: "cream",
      description:
        "Private process where disputes are resolved by one or more arbitrators who issue a binding decision.",
      benefits: [
        "Typically faster than court proceedings",
        "More flexible procedures",
        "Private and confidential",
        "Binding and enforceable decision",
      ],
      considerations: [
        "Limited appeal rights",
        "Potential arbitrator fees",
        "May lack some procedural protections",
        "Can be mandatory in some contracts",
      ],
    },
    {
      id: "settlement",
      label: "Settlement Negotiation",
      color: "blue",
      description:
        "Direct negotiation between parties (or their attorneys) to resolve disputes without third-party intervention.",
      benefits: [
        "Most cost-effective option",
        "Fastest potential resolution",
        "Complete confidentiality",
        "Maximum control over outcome",
      ],
      considerations: [
        "Requires cooperation between parties",
        "No neutral third party to assist",
        "May need legal counsel to ensure fair terms",
        "No guaranteed resolution",
      ],
    },
  ];

  return (
    <div className="mx-auto space-y-8 py-2 pr-2">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="flex items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Sample Legal Scenarios:
            </span>
            <span className="ml-2 text-xs text-gray-500">
              (Click to populate)
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleLegalInputs.map((sample, index) => (
              <button
                key={index}
                onClick={() => handleSampleInput(sample.text)}
                className="px-3 py-1.5 text-sm bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex items-center group"
              >
                <span className="text-gray-600 group-hover:text-blue-600">
                  {sample.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={userInput}
              onChange={handleTextareaInput}
              placeholder="Describe your legal situation, including relevant details such as location, dispute amount, timeline, and your goals..."
              className="w-full min-h-[120px] p-5 text-gray-800 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              style={{ height: "auto" }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleStrategySelect(tab.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-102 ${
                  activeTab === tab.id
                    ? `border-${tab.color}-500 bg-gradient-to-br from-${tab.color}-50 to-${tab.color}-100 text-${tab.color}-700 shadow-md`
                    : "border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="font-semibold">{tab.label}</div>
              </button>
            ))}
          </div>

          {activeTab && (
            <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </h2>
              <p className="text-gray-600">
                {tabs.find((tab) => tab.id === activeTab)?.description}
              </p>
              <div className="mt-4">
                <p className="font-medium text-gray-800">Benefits:</p>
                <ul className="list-disc pl-5 text-gray-600">
                  {tabs
                    .find((tab) => tab.id === activeTab)
                    ?.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                </ul>
              </div>
              <div className="mt-4">
                <p className="font-medium text-gray-800">Considerations:</p>
                <ul className="list-disc pl-5 text-gray-600">
                  {tabs
                    .find((tab) => tab.id === activeTab)
                    ?.considerations.map((consideration, index) => (
                      <li key={index}>{consideration}</li>
                    ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
          <button
            onClick={handleGenerate}
            disabled={!activeTab || isGenerating}
            className={`w-full flex items-center justify-center space-x-3 px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 transform hover:scale-102 ${
              activeTab && !isGenerating
                ? "bg-gradient-to-tr from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white shadow-lg hover:shadow-xl font-semibold"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send className="h-6 w-6" />
            <span>
              {isGenerating
                ? "Generating Legal Pathway..."
                : "Generate Legal Pathway"}
            </span>
          </button>
        </div>
      </div>

      {isGenerating && (
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-2xl mx-auto">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <h3 className="mt-6 text-xl font-semibold text-gray-900">
            Creating Your Personalized Legal Pathway
          </h3>
          <p className="mt-3 text-gray-600">
            Analyzing your situation and generating tailored legal options...
          </p>
        </div>
      )}

      {showFlowchart && serverData && (
        <div
          ref={flowchartRef}
          className="space-y-6 animate-fade-in scroll-mt-8"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="h-[700px] w-full bg-gradient-to-br from-gray-50 to-gray-100">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                className="bg-gray-50"
                defaultEdgeOptions={{
                  type: "smoothstep",
                  animated: true,
                  style: { strokeWidth: 2 },
                }}
              >
                <Background />
                <Controls />
              </ReactFlow>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LegalPathway;
