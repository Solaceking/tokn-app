"use client";

import { useState, useCallback } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export default function CodeBlock({ 
  children, 
  language = "typescript",
  filename,
  showLineNumbers = true 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [children]);

  const getLanguage = (lang: string) => {
    const languageMap: Record<string, string> = {
      "js": "javascript",
      "ts": "typescript",
      "sh": "bash",
      "shell": "bash",
      "env": "bash",
      "yml": "yaml",
    };
    return languageMap[lang] || lang;
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <div className="code-block-header-left">
          {filename && <span className="code-block-filename">{filename}</span>}
          <span className="code-block-language">{language}</span>
        </div>
        <button 
          onClick={handleCopy}
          className="code-block-copy-btn"
          aria-label={copied ? "Copied!" : "Copy code"}
        >
          {copied ? (
            <>
              <Check size={14} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <Highlight
        theme={themes.vsDark}
        code={children.trim()}
        language={getLanguage(language)}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} code-block-pre`} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} className="code-block-line">
                {showLineNumbers && (
                  <span className="code-block-line-number">{i + 1}</span>
                )}
                <span className="code-block-line-content">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
