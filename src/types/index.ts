export interface DogWalk {
  id?: string
  walk_date: string
  walk_time: string
  created_at?: string
  updated_at?: string
}

export interface DogWalkFormData {
  walk_date: string
  walk_time: string
}
