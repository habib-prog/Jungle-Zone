
const BabySitterProfile = () => {
    const profile = {
        name: 'Emma Johnson',
        image: 'https://img.freepik.com/free-photo/selfie-portrait-videocall_23-2149186122.jpg?semt=ais_hybrid&w=740&q=80',
        summary: 'Dedicated and nurturing babysitter with over 5 years of experience caring for children aged 0-12. Passionate about creating safe, fun, and educational environments. DBS checked and first aid certified. Based in London, available for full-time or part-time roles.',
        experience: [
            'Lead Nanny at Happy Tots Daycare, London (2022-Present): Cared for groups of 5-10 children, organized activities, and supported development milestones.',
            'Private Babysitter for the Smith Family (2020-2022): Provided evening and weekend care for two children (ages 3 and 5), including meal prep, bedtime routines, and homework help.',
            'Volunteer at Local Children’s Center (2018-2020): Assisted in after-school programs, focusing on arts and crafts.',
        ],
        qualifications: [
            'NVQ Level 3 in Childcare and Education (2021)',
            'Pediatric First Aid Certificate (Renewed 2025)',
            'DBS Enhanced Check (Valid until 2027)',
            'Safeguarding Children Level 2 (2023)',
        ],
        availability: 'Monday to Friday: 8 AM - 6 PM; Weekends: Flexible upon request. Available for occasional evenings and overnight stays.',
        fees: '£15 per hour (standard rate); £20 per hour (evenings/weekends); Discounts for full-day bookings or long-term commitments.',
        localSchools: [
            'St. Mary’s Primary School, London',
            'Greenfield Academy, London',
            'Little Learners Nursery, London',
        ],
        documents: [
            { name: 'DBS Certificate', url: '#' },
            { name: 'First Aid Certificate', url: '#' },
            { name: 'NVQ Diploma', url: '#' },
            { name: 'References', url: '#' },
        ],
        reviews: [
            {
                id: 1,
                clientImg: "https://img.freepik.com/free-photo/outdoor-shot-young-caucasian-man-with-beard-relaxing-open-air-surrounded-by-beautiful-mountain-setting-rainforest_273609-1855.jpg?semt=ais_hybrid&w=740&q=80",
                clientName: "lorem3",
                clientReview: "asdlkhloremasldfh aosildhalkjnfasifalsnf"
            }
        ]
    };

    return (
        <>
            <header className="pt-40 pb-20">
                <div className="container flex gap-10">
                    <div className="w-40 h-40 block ">
                        <img
                            loading="lazy"
                            src={profile.image}
                            alt={profile.name}
                            className=" w-full h-full object-cover shadow-md"
                        />
                    </div>
                    <div className="text-center md:text-left ">
                        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">{profile.name}</h1>
                        <p className="text-lg mb-8">{profile.summary}</p>
                        <button className="bg-brandColor text-white px-6 py-3 rounded-md hover:bg-brandColor/90 duration-200 cursor-pointer">Contact Provider</button>
                    </div>
                </div>
            </header>

            {/* Profile Sections */}
            <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
                <div className="container">

                    {/* Experience */}
                    <div className="mt-10">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Experience</h2>
                        <ul className="list-disc pl-6 space-y-4 text-gray-600">
                            {profile.experience.map((exp, index) => (
                                <li key={index}>{exp}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Qualifications */}
                    <div className="mt-10">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Qualifications</h2>
                        <ul className="list-disc pl-6 space-y-4 text-gray-600">
                            {profile.qualifications.map((qual, index) => (
                                <li key={index}>{qual}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Availability */}
                    <div className="mt-10">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Availability</h2>
                        <p className="text-gray-600">{profile.availability}</p>
                    </div>

                    {/* Fees */}
                    <div className="mt-10">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Fees</h2>
                        <p className="text-gray-600">{profile.fees}</p>
                    </div>

                    {/* Local Schools */}
                    <div className="mt-10">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Local Schools</h2>
                        <ul className="list-disc pl-6 space-y-4 text-gray-600">
                            {profile.localSchools.map((school, index) => (
                                <li key={index}>{school}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Documents */}
                    <div className="mt-10">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Documents</h2>
                        <ul className="space-y-4">
                            {profile.documents.map((doc, index) => (
                                <li key={index}>
                                    <a href={doc.url} className="text-blue-600 hover:underline">{doc.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Reviews */}
                    <div className="mt-10">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Reviews</h2>
                        <div className="flex flex-col">
                            {profile.reviews.map((doc) => (
                                <div key={doc.id} className="flex items-center gap-10">
                                    <div className="w-40 h-40">
                                        <img loading="lazy" src={doc.clientImg} alt="image" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h2>{doc.clientName}</h2>
                                        <p>{doc.clientReview}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default BabySitterProfile