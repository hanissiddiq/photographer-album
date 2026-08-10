import AlbumDetailPage from "@/components/photographer/albums/[id]/page";

interface Props {
    params: {
        id: string;
    };
}


export default async function Page({ params }: Props) {
    return <AlbumDetailPage params={Promise.resolve(params)} />;
}
