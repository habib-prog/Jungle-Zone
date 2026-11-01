import FIndChildCarePage from "@/app/components/FIndBabySitterPageComponents/FIndBabySitterPage"

const page = async ({ searchParams }) => {
    const params = await searchParams;
    const requestedCategory = params?.category;
    const category = ["babysitting", "cleaning", "cooking"].includes(requestedCategory) ? requestedCategory : "babysitting";
    return (
        <FIndChildCarePage category={category} />
    )
}

export default page
