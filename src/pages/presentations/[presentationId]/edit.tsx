import { useRouter } from "next/router";
import { api } from "../../../utils/api";

export default function Edit() {
    const router = useRouter();
    const {data, isError, isLoading} = api.presentation.getPresentation.useQuery({
        id: String(router.query.presentationId),
    });
    if (isLoading) {
        return <div>Loading</div>;
    }
    return <div> {JSON.stringify(data)}</div>
}