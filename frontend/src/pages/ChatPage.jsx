import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth, useUser } from "@clerk/react";
import { io } from "socket.io-client";
import AppLogo, { APP_NAME } from "../components/AppLogo";
import ThemePresetPicker from "../components/ThemePresetPicker";
import ThemeToggle from "../components/ThemeToggle";
import WallpaperPicker from "../components/WallpaperPicker";
import { useWallpaper } from "../context/wallpaper";

const EMOJI_OPTIONS = ["😊", "😂", "❤️", "👍", "🔥", "🎉", "🤝", "✨"];

async function requestJson(path, options = {}) {
  const response = await fetch(path, {
    credentials: "include",
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      window.location.href = "/auth";
    }
    throw new Error(payload.message || "Request failed");
  }

  return payload;
}

function ChatPage() {
  const { isLoaded } = useAuth();
  const { user: clerkUser } = useUser();
  const { frameStyle } = useWallpaper();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const fileInputRef = useRef(null);
  const activeConversationRef = useRef(activeConversation);
  const socketRef = useRef(null);

  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  useEffect(() => {
    if (!isLoaded) return;

    async function loadProfile() {
      try {
        const profile = await requestJson("/api/auth/check");
        setCurrentUser(profile.user || null);
      } catch (err) {
        setError(err.message);
      }
    }

    loadProfile();
  }, [isLoaded]);

  useEffect(() => {
    async function loadConversations() {
      setLoadingConversations(true);
      setError("");

      try {
        const data = await requestJson("/api/messages/conversations");
        setConversations(data || []);

        if (data?.length) {
          setActiveConversation((prev) => prev || data[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingConversations(false);
      }
    }

    loadConversations();
  }, []);

  useEffect(() => {
    if (!activeConversation) return;

    async function loadMessages() {
      setLoadingMessages(true);
      setError("");

      try {
        const data = await requestJson(`/api/messages/${activeConversation._id}`);
        setMessages(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingMessages(false);
      }
    }

    loadMessages();
  }, [activeConversation]);

  useEffect(() => {
    if (!currentUser?._id) return undefined;

    const socket = io("/", {
      query: { userId: currentUser._id.toString() },
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setError("");
    });

    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users || []);
    });

    const handleIncomingMessage = (message) => {
      const active = activeConversationRef.current;
      const senderId = message.senderId?.toString();
      const receiverId = message.receiverId?.toString();
      const activeId = active?._id?.toString();
      const currentUserId = currentUser._id.toString();

      if (active && (senderId === activeId || receiverId === activeId)) {
        setMessages((prev) => [...prev, message]);
      }

      setConversations((prev) => {
        const partnerId = senderId === currentUserId ? receiverId : senderId;
        const next = prev.filter((conversation) => conversation._id?.toString() !== partnerId);
        return [
          {
            _id: partnerId,
            fullName: activeId === partnerId ? active?.fullName : "New conversation",
            profilePic: activeId === partnerId ? active?.profilePic || "" : "",
          },
          ...next,
        ];
      });
    };

    socket.on("newMessage", handleIncomingMessage);

    socket.on("connect_error", () => {
      setError("Realtime updates are unavailable right now.");
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser]);

  useEffect(() => {
    if (!previewUrl) return undefined;

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const filteredConversations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return conversations;

    return conversations.filter((conversation) => {
      const target = `${conversation.fullName || ""} ${conversation.email || ""}`.toLowerCase();
      return target.includes(query);
    });
  }, [conversations, searchQuery]);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    event.target.value = "";
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const handleSend = async (event) => {
    event.preventDefault();

    if (!activeConversation || (!messageText.trim() && !selectedFile)) return;

    setSending(true);
    setError("");

    try {
      const formData = new FormData();
      if (messageText.trim()) formData.append("text", messageText.trim());
      if (selectedFile) formData.append("media", selectedFile);

      const createdMessage = await requestJson(`/api/messages/send/${activeConversation._id}`, {
        method: "POST",
        body: formData,
      });

      setMessages((prev) => [...prev, createdMessage]);
      setMessageText("");
      setSelectedFile(null);
      setPreviewUrl("");
      setShowEmojiPicker(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
    setIsSidebarOpen(false);
  };

  const isOwnMessage = (message) => message.senderId?.toString() === currentUser?._id?.toString();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm text-[#8E8E93]">Loading your inbox…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.14),_transparent_30%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] text-foreground dark:bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.12),_transparent_25%),linear-gradient(135deg,_#0f172a_0%,_#111827_100%)]">
      <header className="flex items-center justify-between border-b border-slate-200/80 bg-white/80 px-3 py-2 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/80">
        <div className="flex items-center gap-2.5">
          <AppLogo size={32} className="rounded-[8px]" alt="" />
          <div>
            <p className="text-[15px] font-semibold">{APP_NAME}</p>
            <p className="text-xs text-[#8E8E93]">Your private space</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <WallpaperPicker />
          <ThemePresetPicker />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-57px)] flex-col lg:flex-row">
        <aside className={`w-full border-b border-slate-200/80 bg-white/55 p-3 backdrop-blur lg:w-[340px] lg:border-b-0 lg:border-r dark:border-white/10 dark:bg-slate-900/45 ${isSidebarOpen ? "block" : "hidden lg:block"}`}>
          <div className="mb-3 rounded-[20px] border border-indigo-100/80 bg-white/75 p-3 shadow-sm dark:border-indigo-400/15 dark:bg-slate-900/70">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{clerkUser?.fullName || "Your profile"}</p>
                <p className="text-xs text-[#8E8E93]">{clerkUser?.primaryEmailAddress?.emailAddress || "Signed in"}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-teal-500 text-sm font-semibold text-white">
                {clerkUser?.firstName?.[0] || "U"}
              </div>
            </div>

            <label className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-[#636366] dark:text-[#98989D]">
              <span>🔎</span>
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                aria-label="Search conversations"
                placeholder="Search conversations"
                className="w-full bg-transparent outline-none"
              />
            </label>
          </div>

          <div className="space-y-2">
            {loadingConversations ? (
              <div className="rounded-2xl border border-dashed border-border/70 p-4 text-sm text-[#8E8E93]">
                Loading conversations…
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/70 p-4 text-sm text-[#8E8E93]">
                No conversations yet.
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const isActive = activeConversation?._id === conversation._id;
                const isOnline = onlineUsers.includes(conversation._id?.toString());

                return (
                  <button
                    key={conversation._id}
                    type="button"
                    onClick={() => handleSelectConversation(conversation)}
                    className={`flex w-full items-center gap-3 rounded-[18px] border px-3 py-3 text-left transition ${
                      isActive ? "border-indigo-300/70 bg-indigo-50/90 dark:border-indigo-400/30 dark:bg-indigo-950/40" : "border-transparent bg-white/70 hover:bg-indigo-50/70 dark:bg-slate-900/70 dark:hover:bg-white/10"
                    }`}
                  >
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-teal-500 text-sm font-semibold text-white">
                      {(conversation.fullName || "U").slice(0, 1).toUpperCase()}
                      {isOnline ? <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" /> : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold">{conversation.fullName || conversation.email || "Conversation"}</p>
                        <span className="text-[11px] text-[#8E8E93]">{conversation.lastMessageAt ? "Now" : ""}</span>
                      </div>
                      <p className="truncate text-sm text-[#636366] dark:text-[#98989D]">
                        {conversation.email || "Tap to open chat"}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <section className="flex flex-1 flex-col" style={frameStyle}>
          {activeConversation ? (
            <>
              <div className="flex items-center justify-between border-b border-black/10 bg-background/80 px-3 py-3 backdrop-blur-md dark:border-white/10">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Show conversations"
                    className="rounded-full border border-border/70 bg-white/80 p-2 text-sm lg:hidden"
                    onClick={() => setIsSidebarOpen((prev) => !prev)}
                  >
                    ☰
                  </button>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-teal-500 text-sm font-semibold text-white">
                    {(activeConversation.fullName || "U").slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{activeConversation.fullName || activeConversation.email || "Conversation"}</p>
                    <p className="text-xs text-[#8E8E93]">
                      {onlineUsers.includes(activeConversation._id?.toString()) ? "Online" : "Away"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button type="button" className="rounded-full border border-border/70 bg-white/80 px-3 py-2 text-sm text-foreground">
                    Profile
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4">
                {loadingMessages ? (
                  <div className="rounded-2xl border border-dashed border-border/70 bg-background/70 p-4 text-sm text-[#8E8E93]">
                    Loading messages…
                  </div>
                ) : messages.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border/70 bg-background/70 p-4 text-sm text-[#8E8E93]">
                    Start the conversation with a hello.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((message) => {
                      const incoming = !isOwnMessage(message);
                      return (
                        <div key={message._id || `${message.createdAt}-${message.text}`} className={`flex ${incoming ? "justify-start" : "justify-end"}`}>
                          <div className={`max-w-[85%] rounded-[18px] px-3 py-2 text-sm shadow-sm sm:max-w-[70%] ${incoming ? "bg-white/90 text-foreground dark:bg-slate-900/90" : "bg-gradient-to-br from-indigo-600 to-teal-500 text-white"}`}>
                            {message.text ? <p className="whitespace-pre-wrap">{message.text}</p> : null}
                            {message.image ? <img src={message.image} alt="Shared attachment" className="mt-2 max-h-48 rounded-xl object-cover" /> : null}
                            {message.video ? <video controls className="mt-2 max-h-48 rounded-xl" src={message.video} /> : null}
                            <p className={`mt-1 text-[11px] ${incoming ? "text-[#8E8E93]" : "text-white/80"}`}>
                              {new Date(message.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {error ? (
                <div role="alert" className="mx-3 mb-2 flex items-start justify-between gap-3 rounded-2xl border border-amber-400/40 bg-amber-50/90 px-3 py-2 text-sm text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                  <span>{error}</span>
                  <button type="button" onClick={() => setError("")} className="font-semibold underline underline-offset-2">
                    Dismiss
                  </button>
                </div>
              ) : null}

              {previewUrl ? (
                <div className="mx-3 mb-2 rounded-[18px] border border-border/70 bg-background/80 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold">Preview</p>
                    <button type="button" onClick={clearSelectedFile} className="text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-300">
                      Remove
                    </button>
                  </div>
                  {selectedFile?.type?.startsWith("image/") ? <img src={previewUrl} alt="Preview" className="max-h-48 rounded-xl object-cover" /> : <p className="text-sm text-[#636366]">{selectedFile?.name}</p>}
                </div>
              ) : null}

              <form onSubmit={handleSend} className="border-t border-black/10 bg-background/90 p-3 backdrop-blur dark:border-white/10">
                <div className="flex items-end gap-2 rounded-[20px] border border-border/70 bg-white/80 p-2 shadow-sm dark:bg-[#111214]/80">
                  <button type="button" aria-label="Add emoji" onClick={() => setShowEmojiPicker((prev) => !prev)} className="rounded-full p-2 text-xl transition hover:bg-indigo-50 dark:hover:bg-indigo-950/40">
                    😊
                  </button>
                  <button type="button" aria-label="Attach image or video" onClick={() => fileInputRef.current?.click()} className="rounded-full p-2 text-lg transition hover:bg-indigo-50 dark:hover:bg-indigo-950/40">
                    📎
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileSelect} />
                  <textarea
                    value={messageText}
                    onChange={(event) => setMessageText(event.target.value)}
                    aria-label="Message"
                    placeholder="Write a message…"
                    rows={1}
                    className="max-h-32 min-h-[42px] flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
                  />
                  <button type="submit" disabled={sending} className="rounded-full bg-gradient-to-r from-indigo-600 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-700 hover:to-teal-600 disabled:opacity-60">
                    {sending ? "Sending" : "Send"}
                  </button>
                </div>

                {showEmojiPicker ? (
                  <div className="mt-2 flex flex-wrap gap-2 rounded-[18px] border border-border/70 bg-background/80 p-2">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setMessageText((prev) => `${prev}${emoji}`);
                          setShowEmojiPicker(false);
                        }}
                        className="rounded-full p-2 text-xl transition hover:bg-black/5 dark:hover:bg-white/10"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                ) : null}
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-6 text-center text-[#8E8E93]">
              <div className="max-w-sm rounded-[24px] border border-dashed border-border/70 bg-background/70 p-8">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-teal-500 text-2xl text-white shadow-lg shadow-indigo-950/15">
                  CA
                </div>
                <p className="text-lg font-semibold text-foreground">Your space is ready</p>
                <p className="mt-2 text-sm">Select a conversation from the sidebar to view messages, attachments, and settings.</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default ChatPage;
