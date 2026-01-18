"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bot, MessageSquare, Settings, Zap } from "lucide-react";

const AIChatbotSettings = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [autoReply, setAutoReply] = useState(false);
  const [learningMode, setLearningMode] = useState(true);

  return (
    <div className="mx-auto bg-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          AI Chatbot Settings
        </h1>
        <p className="text-gray-600">
          Configure your AI chatbot behavior and responses.
        </p>
      </div>

      <div className="space-y-6">
        {/* Chatbot Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <Bot className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Chatbot Status</CardTitle>
                  <p className="text-sm text-gray-500">
                    Enable or disable the AI chatbot
                  </p>
                </div>
              </div>
              <Badge
                className={
                  isEnabled
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }
              >
                {isEnabled ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Enable AI Chatbot</p>
                <p className="text-sm text-gray-500">
                  Allow visitors to interact with the AI assistant
                </p>
              </div>
              <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
            </div>
          </CardContent>
        </Card>

        {/* Bot Configuration */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Settings className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle>Bot Configuration</CardTitle>
                <p className="text-sm text-gray-500">
                  Customize your chatbot&apos;s personality and responses
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Bot Name
              </label>
              <Input defaultValue="Assistant" placeholder="Enter bot name" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Welcome Message
              </label>
              <Input
                defaultValue="Hello! How can I help you today?"
                placeholder="Enter welcome message"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Fallback Response
              </label>
              <Input
                defaultValue="I'm sorry, I didn't understand that. Could you please rephrase?"
                placeholder="Enter fallback response"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-medium text-gray-900">Auto Reply</p>
                <p className="text-sm text-gray-500">
                  Automatically respond to common queries
                </p>
              </div>
              <Switch checked={autoReply} onCheckedChange={setAutoReply} />
            </div>
          </CardContent>
        </Card>

        {/* AI Features */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                <Zap className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <CardTitle>AI Features</CardTitle>
                <p className="text-sm text-gray-500">
                  Advanced AI capabilities and learning options
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Learning Mode</p>
                <p className="text-sm text-gray-500">
                  Allow the bot to learn from conversations
                </p>
              </div>
              <Switch
                checked={learningMode}
                onCheckedChange={setLearningMode}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Context Memory</p>
                <p className="text-sm text-gray-500">
                  Remember conversation context
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Sentiment Analysis</p>
                <p className="text-sm text-gray-500">
                  Analyze customer emotions in messages
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Chat Statistics */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <MessageSquare className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle>Chat Statistics</CardTitle>
                <p className="text-sm text-gray-500">
                  Overview of chatbot performance
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">1,234</p>
                <p className="text-sm text-gray-500">Total Conversations</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">89%</p>
                <p className="text-sm text-gray-500">Resolution Rate</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">4.2</p>
                <p className="text-sm text-gray-500">Avg. Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <Button variant="outline">Reset to Default</Button>
          <Button className="bg-primary hover:bg-primary">Save Settings</Button>
        </div>
      </div>
    </div>
  );
};

export default AIChatbotSettings;
