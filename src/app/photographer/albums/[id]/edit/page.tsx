import EditAlbumPage from "@/components/photographer/albums/[id]/edit/page";

interface Props {
    params: {
        id: string;
    };
}

export default async function Page({ params }: Props) {
    return <EditAlbumPage params={Promise.resolve(params)} />;
}
