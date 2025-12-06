/**
 * Pinata IPFS Integration
 * Uploads NFT metadata and images to IPFS via Pinata
 */

export interface PinataMetadata {
  name: string;
  description: string;
  image: string; // IPFS hash or URL
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

class PinataService {
  private apiKey: string;
  private secretKey: string;
  private jwtToken: string;
  private gatewayUrl: string;

  constructor() {
    this.apiKey = process.env.REACT_APP_PINATA_API_KEY || '';
    this.secretKey = process.env.REACT_APP_PINATA_SECRET_KEY || '';
    this.jwtToken = process.env.REACT_APP_PINATA_JWT || '';
    this.gatewayUrl = process.env.REACT_APP_PINATA_GATEWAY_URL || 'https://gateway.pinata.cloud/ipfs/';
  }

  /**
   * Check if Pinata is configured
   */
  isConfigured(): boolean {
    // Prefer JWT token, fallback to API key + secret
    return !!(this.jwtToken || (this.apiKey && this.secretKey));
  }

  /**
   * Get authorization headers
   */
  private getAuthHeaders(): Record<string, string> {
    if (this.jwtToken) {
      return {
        'Authorization': `Bearer ${this.jwtToken}`,
      };
    } else {
      return {
        'pinata_api_key': this.apiKey,
        'pinata_secret_api_key': this.secretKey,
      };
    }
  }

  /**
   * Upload JSON metadata to Pinata
   */
  async uploadMetadata(metadata: PinataMetadata): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Pinata API keys not configured. Please set REACT_APP_PINATA_API_KEY and REACT_APP_PINATA_SECRET_KEY');
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      };

      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          pinataContent: metadata,
          pinataMetadata: {
            name: `NFT-${metadata.name}-${Date.now()}`,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Pinata upload failed: ${error.error || response.statusText}`);
      }

      const data: PinataResponse = await response.json();
      return data.IpfsHash;
    } catch (error: any) {
      console.error('Pinata upload error:', error);
      throw new Error(`Failed to upload to Pinata: ${error.message}`);
    }
  }

  /**
   * Upload image file to Pinata
   */
  async uploadImage(file: File): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Pinata API keys not configured');
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const metadata = JSON.stringify({
        name: `NFT-Image-${Date.now()}`,
      });
      formData.append('pinataMetadata', metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append('pinataOptions', options);

      const headers = this.getAuthHeaders();

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Pinata upload failed: ${error.error || response.statusText}`);
      }

      const data: PinataResponse = await response.json();
      return data.IpfsHash;
    } catch (error: any) {
      console.error('Pinata image upload error:', error);
      throw new Error(`Failed to upload image to Pinata: ${error.message}`);
    }
  }

  /**
   * Get IPFS URL from hash
   */
  getIpfsUrl(hash: string): string {
    // Remove 'ipfs://' prefix if present
    const cleanHash = hash.replace(/^ipfs:\/\//, '');
    return `${this.gatewayUrl}${cleanHash}`;
  }

  /**
   * Create NFT metadata JSON
   */
  createMetadata(
    name: string,
    description: string,
    imageHash: string,
    traits: Array<{ trait_type: string; value: string }>
  ): PinataMetadata {
    return {
      name,
      description,
      image: `ipfs://${imageHash}`,
      attributes: traits,
    };
  }
}

export const pinataService = new PinataService();

