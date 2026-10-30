 export type Resource = {
        id: number;
        resource_name: string;
        resource_url: string;
        resource_type: string ;
        resource_image: string
        resource_description: string;
        is_favorite: boolean;
        created_at: string;
    };



 export  type CollectionWithResources = {
        id: number;
        collection_name: string;
        resources: Resource[];
    };

export type UserData = {
  collections: CollectionWithResources[];
  uncategorizedResources: Resource[];
};