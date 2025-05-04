/**
 * Custom Chat interface that extends the OpenAPI generated Chat interface
 * to include the seen status properties
 */
export interface Chat {
    id?: string;
    sender?: string;
    receiver?: string;
    content?: string;
    timestamp?: string;
    type?: string;
    
    // Added properties for seen functionality
    seen?: boolean;
    seenAt?: string;
}
