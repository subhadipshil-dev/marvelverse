export interface Movie {
  id: string;
  title: string;
  thumbnail: string;
  timelineYear: number;
  releaseYear: number;
  phase: string;
  runtime: string;
  imdbRating: number;
  ottPlatforms: string[];
  watchUrl: string;
  downloadUrl: string;
  trailerUrl: string;
  cast: string[];
  synopsis: string;
  orderIndex: number;
}

export interface Phase {
  name: string;
  color: string;
  movies: number;
}

export interface Platform {
  name: string;
  color: string;
  logo: string;
}
