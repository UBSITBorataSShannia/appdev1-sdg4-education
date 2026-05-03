// Model for Open Library API response (books/education resources)
export interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  subject?: string[];
  cover_i?: number;
  publisher?: string[];
  language?: string[];
  edition_count?: number;
  ia?: string[];
}
 
export interface OpenLibraryResponse {
  numFound: number;
  start: number;
  docs: OpenLibraryDoc[];
}
 
// Model for REST Countries API (education statistics per country)
export interface Country {
  name: {
    common: string;
    official: string;
  };
  flags: {
    png: string;
    alt?: string;
  };
  region: string;
  subregion?: string;
  population: number;
  languages?: { [key: string]: string };
  capital?: string[];
}
 
// Model for SDG4 Goal/Target
export interface Sdg4Target {
  id: string;
  title: string;
  description: string;
  icon: string;
}