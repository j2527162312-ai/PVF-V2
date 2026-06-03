export type MediaType = 'video' | 'image';

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
}

export interface Playlist {
  id: string;
  name: string;
  itemIds: string[];
}
