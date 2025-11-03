export const generateRoomId = (): string => {
  return "room_" + Math.random().toString(36).substring(2, 10);
};
