import FIndChildCareBanner from "./FIndBabySitterBanner"
import SearchChildCare from "./SearchBabySitter"

const FIndBabySitterPage = ({ category = "babysitting" }) => {
    return (
        <>
            <FIndChildCareBanner category={category} />
            <SearchChildCare category={category} />
        </>
    )
}

export default FIndBabySitterPage
