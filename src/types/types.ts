export interface ReleaseAsset {
    size_mb: number;
    sha256: string;
    url: string;
}

export interface PreviousNote {
    version: string;
    released: string; // ISO format
    notes: string;
}

export interface SoftwareRelease {
    version: string;
    released: string; // ISO format
    assets: {
        [platform: string]: ReleaseAsset;
    };
    notes: string;
    prev_notes: PreviousNote[];
}