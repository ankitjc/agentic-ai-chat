import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Form, Card, Button } from "react-bootstrap";

function ChatApp() {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "👋 Hey there! I’m your AI assistant — how can I help today?" },
    ]);
    const [input, setInput] = useState("");
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Call backend /chat endpoint
    const sendMessageToBackend = async (userMessage) => {
        try {
            const response = await fetch("https://agentic-ai-server.vercel.app/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });
            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error("Error calling backend:", error);
            return "Sorry, something went wrong while processing your message.";
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        const newMessages = [...messages, { sender: "user", text: userMessage }];
        setMessages(newMessages);
        setInput("");

        // Add a temporary "processing" message
        const processingMessage = { sender: "bot", text: "Let me process that for you..." };
        setMessages((prev) => [...prev, processingMessage]);

        // Call backend
        const botResponse = await sendMessageToBackend(userMessage);

        // Replace the "processing" message with the real response
        setMessages((prev) => {
            const temp = [...prev];
            temp.pop(); // remove processing message
            temp.push({ sender: "bot", text: botResponse });
            return temp;
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Container fluid className="vh-100 d-flex flex-column bg-light">
            {/* Header */}
            <Row className="chat-header text-white shadow-sm py-3 px-4">
                <Col>
                    <h4 className="mb-0 fw-semibold">🤖 AI Assistant</h4>
                    <small className="text-light opacity-75">
                        Smart answers, real-time insights
                    </small>
                </Col>
            </Row>

            {/* Chat Messages */}
            <Row className="flex-grow-1 overflow-auto p-3">
                <Col md={{ span: 8, offset: 2 }}>
                    <Card className="border-0 shadow-sm chat-window">
                        <Card.Body className="p-4">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`d-flex mb-3 ${
                                        msg.sender === "user"
                                            ? "justify-content-end"
                                            : "justify-content-start"
                                    }`}
                                >
                                    <div
                                        className={`p-3 rounded-4 ${
                                            msg.sender === "user"
                                                ? "bg-primary text-white"
                                                : "bg-white border"
                                        }`}
                                        style={{
                                            maxWidth: "75%",
                                            fontSize: "1rem",
                                            lineHeight: "1.4",
                                        }}
                                    >
                                        {typeof msg.text === "string" ? msg.text : JSON.stringify(msg.text, null, 2)}
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Input Area */}
            <Row className="p-3 bg-white border-top">
                <Col md={{ span: 8, offset: 2 }}>
                    <Form className="d-flex align-items-center">
                        <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Ask me anything..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="chat-input shadow-sm"
                        />
                        <Button variant="primary" className="ms-2" onClick={handleSend}>
                            Send
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default ChatApp;
