type SuspiciousInput = {
  storedUserAgent?: string;
  currentUserAgent?: string;
};

export function isSuspiciousActivity({
  currentUserAgent,
}: {
  currentUserAgent?: string;
}) {
  if (!currentUserAgent) return false;

  const current = currentUserAgent.toLowerCase();

  const botLikeAgents = [
    "curl",
    "postman",
    "python",
    "scrapy",
    "bot",
  ];

  return botLikeAgents.some((agent) =>
    current.includes(agent)
  );
}