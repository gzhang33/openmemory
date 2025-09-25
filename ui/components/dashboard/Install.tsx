"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const clientTabs = [
  { key: "claude", label: "Claude", icon: "/images/claude.webp" },
  { key: "cursor", label: "Cursor", icon: "/images/cursor.png" },
  { key: "cline", label: "Cline", icon: "/images/cline.png" },
  { key: "roocline", label: "Roo Cline", icon: "/images/roocline.png" },
  { key: "windsurf", label: "Windsurf", icon: "/images/windsurf.png" },
  { key: "witsy", label: "Witsy", icon: "/images/witsy.png" },
  { key: "enconvo", label: "Enconvo", icon: "/images/enconvo.png" },
  { key: "augment", label: "Augment", icon: "/images/augment.png" },
  { key: "codex", label: "Codex", icon: "/images/Codex.png" },
];

const colorGradientMap: { [key: string]: string } = {
  claude:
    "data-[state=active]:bg-[linear-gradient(to_top,_rgba(239,108,60,0.3),_rgba(239,108,60,0))] data-[state=active]:border-[#EF6C3C]",
  cline:
    "data-[state=active]:bg-[linear-gradient(to_top,_rgba(112,128,144,0.3),_rgba(112,128,144,0))] data-[state=active]:border-[#708090]",
  cursor:
    "data-[state=active]:bg-[linear-gradient(to_top,_rgba(255,255,255,0.08),_rgba(255,255,255,0))] data-[state=active]:border-[#708090]",
  roocline:
    "data-[state=active]:bg-[linear-gradient(to_top,_rgba(45,32,92,0.8),_rgba(45,32,92,0))] data-[state=active]:border-[#7E3FF2]",
  windsurf:
    "data-[state=active]:bg-[linear-gradient(to_top,_rgba(0,176,137,0.3),_rgba(0,176,137,0))] data-[state=active]:border-[#00B089]",
  witsy:
    "data-[state=active]:bg-[linear-gradient(to_top,_rgba(33,135,255,0.3),_rgba(33,135,255,0))] data-[state=active]:border-[#2187FF]",
  enconvo:
    "data-[state=active]:bg-[linear-gradient(to_top,_rgba(126,63,242,0.3),_rgba(126,63,242,0))] data-[state=active]:border-[#7E3FF2]",
  codex:
    "data-[state=active]:bg-[linear-gradient(to_top,_rgba(33,135,255,0.3),_rgba(33,135,255,0))] data-[state=active]:border-[#2187FF]",
};

const getColorGradient = (color: string) => {
  if (colorGradientMap[color]) {
    return colorGradientMap[color];
  }
  return "data-[state=active]:bg-[linear-gradient(to_top,_rgba(126,63,242,0.3),_rgba(126,63,242,0))] data-[state=active]:border-[#7E3FF2]";
};

const allTabs = [{ key: "mcp", label: "MCP Link", icon: "🔗" }, ...clientTabs];

const codexPlatforms = [
  { key: "windows", label: "Windows" },
  { key: "mac", label: "macOS" },
  { key: "linux", label: "Linux" },
] as const;

const codexScriptButtons = [
  {
    key: "windows",
    label: "下载 PowerShell 脚本 (Windows)",
    href: "/scripts/install-codex.ps1",
  },
  {
    key: "python",
    label: "下载 Python 脚本 (macOS / Linux)",
    href: "/scripts/install-codex.py",
  },
];

const codexDeploymentOptions = [
  {
    key: "local",
    label: "本地安装",
    description: "在本地机器上安装和配置codex",
    platforms: ["Windows", "macOS", "Linux"]
  }
];

type CodexPlatform = (typeof codexPlatforms)[number]["key"];

const buildCodexConfig = (url: string, userId: string, platform: CodexPlatform) => {
  const baseUrl = `${url}/mcp/codex/sse/${userId}`;

  if (platform === "windows") {
    return `[mcp_servers.openmemory-local]
command = "cmd"
args = [
    "/c",
    "npx",
    "-y",
    "supergateway",
    "--sse",
    "${baseUrl}"
]
env = { SystemRoot="C\\Windows" }
startup_timeout_ms = 20_000`;
  }

  return `[mcp_servers.openmemory-local]
command = "npx"
args = [
    "-y",
    "supergateway",
    "--sse",
    "${baseUrl}"
]
startup_timeout_ms = 20_000`;
};


export const Install = () => {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [codexPlatform, setCodexPlatform] = useState<CodexPlatform>("windows");
  const user = process.env.NEXT_PUBLIC_USER_ID || "user";

  const URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8765";

  const handleCopy = async (tab: string, isMcp: boolean = false) => {
    const text = isMcp
      ? `${URL}/mcp/openmemory/sse/${user}`
      : `npx @openmemory/install local ${URL}/mcp/${tab}/sse/${user} --client ${tab}`;

    try {
      // Try using the Clipboard API first
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback: Create a temporary textarea element
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      // Update UI to show success
      setCopiedTab(tab);
      setTimeout(() => setCopiedTab(null), 1500); // Reset after 1.5s
    } catch (error) {
      console.error("Failed to copy text:", error);
      // You might want to add a toast notification here to show the error
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Install OpenMemory</h2>

      <div className="hidden">
        <div className="data-[state=active]:bg-[linear-gradient(to_top,_rgba(239,108,60,0.3),_rgba(239,108,60,0))] data-[state=active]:border-[#EF6C3C]"></div>
        <div className="data-[state=active]:bg-[linear-gradient(to_top,_rgba(112,128,144,0.3),_rgba(112,128,144,0))] data-[state=active]:border-[#708090]"></div>
        <div className="data-[state=active]:bg-[linear-gradient(to_top,_rgba(45,32,92,0.3),_rgba(45,32,92,0))] data-[state=active]:border-[#2D205C]"></div>
        <div className="data-[state=active]:bg-[linear-gradient(to_top,_rgba(0,176,137,0.3),_rgba(0,176,137,0))] data-[state=active]:border-[#00B089]"></div>
        <div className="data-[state=active]:bg-[linear-gradient(to_top,_rgba(33,135,255,0.3),_rgba(33,135,255,0))] data-[state=active]:border-[#2187FF]"></div>
        <div className="data-[state=active]:bg-[linear-gradient(to_top,_rgba(126,63,242,0.3),_rgba(126,63,242,0))] data-[state=active]:border-[#7E3FF2]"></div>
        <div className="data-[state=active]:bg-[linear-gradient(to_top,_rgba(239,108,60,0.3),_rgba(239,108,60,0))] data-[state=active]:border-[#EF6C3C]"></div>
        <div className="data-[state=active]:bg-[linear-gradient(to_top,_rgba(107,33,168,0.3),_rgba(107,33,168,0))] data-[state=active]:border-primary"></div>
        <div className="data-[state=active]:bg-[linear-gradient(to_top,_rgba(255,255,255,0.08),_rgba(255,255,255,0))] data-[state=active]:border-[#708090]"></div>
      </div>

      <Tabs defaultValue="claude" className="w-full">
        <TabsList className="bg-transparent border-b border-zinc-800 rounded-none w-full justify-start gap-0 p-0 grid grid-cols-10">
          {allTabs.map(({ key, label, icon }) => (
            <TabsTrigger
              key={key}
              value={key}
              className={`flex-1 px-0 pb-2 rounded-none ${getColorGradient(
                key
              )} data-[state=active]:border-b-2 data-[state=active]:shadow-none text-zinc-400 data-[state=active]:text-white flex items-center justify-center gap-2 text-sm`}
            >
              {icon.startsWith("/") ? (
                <div>
                  <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center overflow-hidden">
                    <Image src={icon} alt={label} width={40} height={40} />
                  </div>
                </div>
              ) : (
                <div className="h-6">
                  <span className="relative top-1">{icon}</span>
                </div>
              )}
              <span>{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* MCP Tab Content */}
        <TabsContent value="mcp" className="mt-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="py-4">
              <CardTitle className="text-white text-xl">MCP Link</CardTitle>
            </CardHeader>
            <hr className="border-zinc-800" />
            <CardContent className="py-4">
              <div className="relative">
                <pre className="bg-zinc-800 px-4 py-3 rounded-md overflow-x-auto text-sm">
                  <code className="text-gray-300">
                    {URL}/mcp/openmemory/sse/{user}
                  </code>
                </pre>
                <div>
                  <button
                    className="absolute top-0 right-0 py-3 px-4 rounded-md hover:bg-zinc-600 bg-zinc-700"
                    aria-label="Copy to clipboard"
                    onClick={() => handleCopy("mcp", true)}
                  >
                    {copiedTab === "mcp" ? (
                      <Check className="h-5 w-5 text-green-400" />
                    ) : (
                      <Copy className="h-5 w-5 text-zinc-400" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Client Tabs Content */}
        {clientTabs.map(({ key }) => (
          <TabsContent key={key} value={key} className="mt-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="py-4">
                <CardTitle className="text-white text-xl">
                  {key === "codex"
                    ? "Codex Configuration"
                    : `${key.charAt(0).toUpperCase() + key.slice(1)} Installation Command`}
                </CardTitle>
              </CardHeader>
              <hr className="border-zinc-800" />
              <CardContent className="py-4">
                {key === "codex" ? (
                  <>
                    {/* 平台选择 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {codexPlatforms.map((platform) => (
                        <button
                          key={platform.key}
                          className={`px-3 py-1 text-xs rounded-md border ${
                            codexPlatform === platform.key
                              ? "bg-primary text-white border-primary"
                              : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                          }`}
                          onClick={() => setCodexPlatform(platform.key)}
                        >
                          {platform.label}
                        </button>
                      ))}
                    </div>

                    {/* 安装脚本按钮 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {codexScriptButtons.map(({ key: scriptKey, label, href }) => (
                        <Button key={scriptKey} size="sm" variant="secondary" asChild>
                          <a href={href} download>
                            {label}
                          </a>
                        </Button>
                      ))}
                    </div>

                    <p className="text-xs text-zinc-400 mb-4">
                      复制配置到 Codex 的 config.toml 文件中。
                    </p>

                    <div className="relative mb-4">
                      <pre className="bg-zinc-800 px-4 py-3 rounded-md overflow-x-auto text-sm whitespace-pre">
                        <code className="text-gray-300">
                          {buildCodexConfig(URL, user, codexPlatform)}
                        </code>
                      </pre>
                      <div>
                        <button
                          className="absolute top-0 right-0 py-3 px-4 rounded-md hover:bg-zinc-600 bg-zinc-700"
                          aria-label="Copy configuration"
                          onClick={() => {
                            handleCopy(
                              `codex-config-${codexPlatform}`,
                              false,
                            );
                          }}
                        >
                          {copiedTab === `codex-config-${codexPlatform}` ? (
                            <Check className="h-5 w-5 text-green-400" />
                          ) : (
                            <Copy className="h-5 w-5 text-zinc-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="relative">
                    <pre className="bg-zinc-800 px-4 py-3 rounded-md overflow-x-auto text-sm whitespace-pre">
                      <code className="text-gray-300">
                        {`npx @openmemory/install local ${URL}/mcp/${key}/sse/${user} --client ${key}`}
                      </code>
                    </pre>
                    <div>
                      <button
                        className="absolute top-0 right-0 py-3 px-4 rounded-md hover:bg-zinc-600 bg-zinc-700"
                        aria-label="Copy to clipboard"
                        onClick={() => handleCopy(key)}
                      >
                        {copiedTab === key ? (
                          <Check className="h-5 w-5 text-green-400" />
                        ) : (
                          <Copy className="h-5 w-5 text-zinc-400" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Install;
