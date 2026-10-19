import { createClient } from "@/lib/supabase/server"

export default async function CollectionCards() {
    const supabase = await createClient()

    const { data: {user} } = await supabase.auth.getUser()

    if (!user) {
        return
    }
    // question i have to ask tommorow what if we want a null resources  

    const fetchData = await supabase
        .from('collections')
        .select(`
        collection_name,
        resources:collection_resources (
            resource:resources (
            resource_name,
            resource_url,
            resource_description
            )
        )
        `)
        .eq('user_id', user.id)


  return (
    <div>CollectionCards</div>
  )
}
