import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Form, Card } from "react-bootstrap";

function ChatApp() {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "👋 Hey there! I’m your AI assistant — how can I help today?" },
    ]);
    const [input, setInput] = useState("");
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle sending messages
    const handleSend = () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { sender: "user", text: input }];
        setMessages(newMessages);
        setInput("");

        // Simulate bot reply
        setTimeout(() => {
            setMessages([
                ...newMessages,
                { sender: "bot", text: "Let me process that for you..." },
            ]);
        }, 800);
    };

    // Handle Enter / Shift+Enter
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // prevent newline
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
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Input Area (Enter to Send) */}
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
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default ChatApp;
