import rawMedia from "./mediaData.json";
import { MediaItem, Playlist, MediaType } from "./types";

// Normalize the raw data from Google Drive
export const getMediaItems = (): MediaItem[] => {
  return rawMedia.map((item) => {
    const lowerTitle = item.title.toLowerCase();
    let normalizedType: MediaType = "video";

    if (
      item.type === "image" ||
      lowerTitle.endsWith(".jpg") ||
      lowerTitle.endsWith(".jpeg") ||
      lowerTitle.endsWith(".png") ||
      lowerTitle.endsWith(".webp") ||
      lowerTitle.endsWith(".gif") ||
      lowerTitle.endsWith(".avif")
    ) {
      normalizedType = "image";
    }

    return {
      id: item.id,
      title: item.title,
      type: normalizedType,
    };
  });
};

// LocalStorage Keys
const PLAYLISTS_STORAGE_KEY = "clean_personal_tiktok_playlists";

export const getPlaylists = (): Playlist[] => {
  const data = localStorage.getItem(PLAYLISTS_STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Error parsing playlists", e);
    return [];
  }
};

export const savePlaylists = (playlists: Playlist[]): void => {
  localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(playlists));
};

export const createPlaylist = (name: string): Playlist => {
  const playlists = getPlaylists();
  const newPlaylist: Playlist = {
    id: `playlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: name.trim(),
    itemIds: [],
  };
  playlists.push(newPlaylist);
  savePlaylists(playlists);
  return newPlaylist;
};

export const deletePlaylist = (playlistId: string): void => {
  const playlists = getPlaylists();
  const filtered = playlists.filter((p) => p.id !== playlistId);
  savePlaylists(filtered);
};

export const addItemToPlaylist = (playlistId: string, itemId: string): void => {
  const playlists = getPlaylists();
  const playlist = playlists.find((p) => p.id === playlistId);
  if (playlist) {
    if (!playlist.itemIds.includes(itemId)) {
      playlist.itemIds.push(itemId);
      savePlaylists(playlists);
    }
  }
};

export const removeItemFromPlaylist = (playlistId: string, itemId: string): void => {
  const playlists = getPlaylists();
  const playlist = playlists.find((p) => p.id === playlistId);
  if (playlist) {
    playlist.itemIds = playlist.itemIds.filter((id) => id !== itemId);
    savePlaylists(playlists);
  }
};

// Help helper to shuffle items (for randomizer option)
export const shuffleArray = <T>(array: T[]): T[] => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};
