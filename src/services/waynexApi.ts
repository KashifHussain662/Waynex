import { chatRepository, routeRepository } from "./repositories";

export async function getRouteDashboard() {
  return routeRepository.getDashboard("Nathia Gali");
}

export async function getConversations() {
  const inbox = await chatRepository.getInbox();
  return inbox.conversations;
}
