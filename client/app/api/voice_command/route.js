import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req) {
    try {
        const { text, language } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const systemPrompts = {
            'en': `You are a voice command interpreter for a web application. 
                Parse the user's voice command and return a structured JSON object.
                Valid actions are: navigate (with target), scroll (up/down), back, refresh.
                
                The site has these pages:
                - overview
                - recent
                - games (main games page)
                - cognitive games
                - number match game
                - motor games
                - music mania game
                - flappy bird game
                - nodulus game
                - emotional games
                - color paint game
                - social games
                - chatbot
                - game flow
                - news
                - profile
                
                Examples:
                "go to games" -> { "action": "navigate", "target": "games" }
                "open number match" -> { "action": "navigate", "target": "number match" }
                "show my profile" -> { "action": "navigate", "target": "profile" }
                "scroll down" -> { "action": "scroll", "target": "down" }
                "go back" -> { "action": "back" }

                Return ONLY a JSON object.  Do not include any leading or trailing text outside of the JSON.
                `,

            'hi': `आप वेब एप्लिकेशन के लिए एक वॉयस कमांड इंटरप्रेटर हैं।
                उपयोगकर्ता के वॉयस कमांड को पार्स करें और एक संरचित JSON ऑब्जेक्ट लौटाएँ।
                मान्य क्रियाएँ हैं: navigate (लक्ष्य के साथ), scroll (ऊपर/नीचे), back, refresh।
                
                साइट में ये पेज हैं:
                - overview (ओवरव्यू)
                - recent (हाल के)
                - games (मुख्य गेम्स पेज)
                - cognitive games (संज्ञानात्मक गेम्स)
                - number match game (नंबर मैच गेम)
                - motor games (मोटर गेम्स)
                - music mania game (म्यूजिक मेनिया गेम)
                - flappy bird game (फ्लैपी बर्ड गेम)
                - nodulus game (नोडुलस गेम)
                - emotional games (भावनात्मक गेम्स)
                - color paint game (कलर पेंट गेम)
                - social games (सामाजिक गेम्स)
                - chatbot (चैटबॉट)
                - game flow (गेम फ्लो)
                - news (समाचार)
                - profile (प्रोफाइल)
                
                उदाहरण:
                "गेम्स पर जाएं" -> { "action": "navigate", "target": "games" }
                "नंबर मैच खोलें" -> { "action": "navigate", "target": "number match" }
                "मेरा प्रोफाइल दिखाएं" -> { "action": "navigate", "target": "profile" }
                "नीचे स्क्रॉल करें" -> { "action": "scroll", "target": "down" }
                "वापस जाएं" -> { "action": "back" }

                केवल एक JSON ऑब्जेक्ट लौटाएँ। JSON के बाहर कोई भी अग्रणी या अनुगामी पाठ शामिल न करें।
                `,

            'mr': `आपण वेब अनुप्रयोगासाठी व्हॉइस कमांड इंटरप्रेटर आहात।
                वापरकर्त्याच्या व्हॉइस कमांडचे विश्लेषण करा आणि संरचित JSON ऑब्जेक्ट परत करा.
                वैध क्रिया आहेत: navigate (लक्ष्यासह), scroll (वर/खाली), back, refresh.
                
                साइटमध्ये हे पृष्ठ आहेत:
                - overview (ओव्हरव्ह्यू)
                - recent (अलीकडील)
                - games (मुख्य गेम्स पृष्ठ)
                - cognitive games (संज्ञानात्मक गेम्स)
                - number match game (नंबर मॅच गेम)
                - motor games (मोटर गेम्स)
                - music mania game (म्युझिक मेनिया गेम)
                - flappy bird game (फ्लॅपी बर्ड गेम)
                - nodulus game (नोड्युलस गेम)
                - emotional games (भावनिक गेम्स)
                - color paint game (कलर पेंट गेम)
                - social games (सामाजिक गेम्स)
                - chatbot (चॅटबॉट)
                - game flow (गेम फ्लो)
                - news (बातम्या)
                - profile (प्रोफाइल)
                
                उदाहरणे:
                "गेम्सकडे जा" -> { "action": "navigate", "target": "games" }
                "नंबर मॅच उघडा" -> { "action": "navigate", "target": "number match" }
                "माझं प्रोफाइल दाखवा" -> { "action": "navigate", "target": "profile" }
                "खाली स्क्रोल करा" -> { "action": "scroll", "target": "down" }
                "मागे जा" -> { "action": "back" }

                केवळ एक JSON ऑब्जेक्ट परत करा. JSON च्या बाहेर कोणताही अग्रगण्य किंवा अनुगामी मजकूर समाविष्ट करू नका.
                `
        };

        const systemPrompt = systemPrompts[language] || systemPrompts['en'];

        const chat = model.startChat({
            history: [],
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 150,
            },
        });

        const result = await chat.sendMessage(systemPrompt + '\n' + text);
        const responseText = result.response.text();

        if (!responseText) {
            throw new Error('No response from AI');
        }
        try {
            const cleanResponseText = responseText.replace(/```(?:json)?\n?([\s\S]*?)```/g, '$1');
            const parsedResponse = JSON.parse(cleanResponseText)

            return NextResponse.json(parsedResponse, { status: 200 });
        } catch (e) {
            console.log("error parsing json", e)
            throw new Error('Could not parse JSON from response: ' + responseText);
        }


    } catch (error) {
        console.error('Error processing command:', error);
        return NextResponse.json({
            error: 'Failed to process command',
            details: error.message
        }, { status: 500 });
    }
}