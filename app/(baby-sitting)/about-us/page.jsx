import Link from "next/link"

const page = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section with Mission */}
            <section className="relative py-20 bg-linear-to-br from-brandColor/10 to-brandColor/5">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="font-poppins text-5xl font-bold text-[#4c494a] mb-6">
                        About Us
                    </h1>
                    <p className="font-nunito text-xl text-[#555555] max-w-3xl mx-auto leading-relaxed">
                        Making childcare accessible to every UK family. We believe every child deserves
                        loving, trustworthy care, and every parent deserves peace of mind.
                    </p>
                </div>
            </section>
            {/* Mission Statement */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="font-poppins text-3xl font-semibold text-brandColor mb-6">
                            Our Mission
                        </h2>
                        <p className="font-nunito text-lg text-[#555555] leading-relaxed">
                            To transform childcare in the UK by connecting families with trusted,
                            qualified babysitters — making quality childcare accessible, affordable,
                            and reliable for every household.
                        </p>
                    </div>
                </div>
            </section>
            {/* Founder Story */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Founder Image */}
                            <div className="relative">
                                <div className="aspect-square rounded-2xl overflow-hidden bg-brandColor/10 flex items-center justify-center">
                                    <svg className="w-32 h-32 text-brandColor/30" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                </div>
                                <div className="absolute -bottom-6 -right-6 bg-brandColor text-white px-6 py-4 rounded-xl shadow-lg">
                                    <p className="font-poppins font-semibold text-sm">Founded in 2020</p>
                                    <p className="font-nunito text-xs">London, UK</p>
                                </div>
                            </div>
                            {/* Story Content */}
                            <div>
                                <h2 className="font-poppins text-3xl font-bold text-[#4c494a] mb-6">
                                    Why We Built This
                                </h2>
                                <div className="space-y-4 font-nunito text-[#555555] leading-relaxed">
                                    <p>
                                        Our journey began with a personal struggle. As new parents living in London,
                                        we found ourselves overwhelmed — juggling demanding careers, family responsibilities,
                                        and the constant challenge of finding trustworthy childcare we could rely on.
                                    </p>
                                    <p>
                                        After a particularly stressful week of cancelled babysitters and last-minute
                                        disappointments, we realized we weren't alone. Across the UK, millions of parents
                                        face the same anxiety — the lack of a reliable, transparent, and human-centered
                                        childcare solution.
                                    </p>
                                    <p>
                                        That moment sparked a mission: to build a platform where every family could find
                                        vetted, compassionate babysitters they could trust like family. We wanted to create
                                        more than a booking service — we wanted to build a community that understands
                                        the real challenges of modern parenting.
                                    </p>
                                    <p className="text-brandColor font-medium">
                                        Today, we&apos;ve helped over 50,000 UK families find childcare they can trust.
                                        But our story is just beginning — and we'd love for you to be part of it.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Team Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="font-poppins text-3xl font-bold text-[#4c494a] mb-4">
                            Meet Our Team
                        </h2>
                        <p className="font-nunito text-[#555555] max-w-2xl mx-auto">
                            The passionate people behind our mission. Real faces, real commitment,
                            real love for transforming childcare in the UK.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {/* Team Member 1 - Founder/CEO */}
                        <div className="text-center group">
                            <div className="aspect-square rounded-full overflow-hidden bg-brandColor/10 mx-auto mb-4 flex items-center justify-center border-4 border-brandColor/20 group-hover:border-brandColor/40 transition-all">
                                <svg className="w-24 h-24 text-brandColor/30" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </div>
                            <h3 className="font-poppins text-lg font-semibold text-[#4c494a]">
                                Sarah Mitchell
                            </h3>
                            <p className="font-nunito text-sm text-brandColor mb-2">
                                Founder & CEO
                            </p>
                            <p className="font-nunito text-xs text-[#555555] leading-relaxed">
                                Former early years educator turned entrepreneur. Believes every child deserves
                                nurturing care and every parent deserves peace of mind.
                            </p>
                        </div>
                        {/* Team Member 2 - Operations */}
                        <div className="text-center group">
                            <div className="aspect-square rounded-full overflow-hidden bg-brandColor/10 mx-auto mb-4 flex items-center justify-center border-4 border-brandColor/20 group-hover:border-brandColor/40 transition-all">
                                <svg className="w-24 h-24 text-brandColor/30" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </div>
                            <h3 className="font-poppins text-lg font-semibold text-[#4c494a]">
                                James Chen
                            </h3>
                            <p className="font-nunito text-sm text-brandColor mb-2">
                                Head of Operations
                            </p>
                            <p className="font-nunito text-xs text-[#555555] leading-relaxed">
                                Ensures every booking is smooth and every family feels supported —
                                from first click to final goodbye.
                            </p>
                        </div>
                        {/* Team Member 3 - Community */}
                        <div className="text-center group">
                            <div className="aspect-square rounded-full overflow-hidden bg-brandColor/10 mx-auto mb-4 flex items-center justify-center border-4 border-brandColor/20 group-hover:border-brandColor/40 transition-all">
                                <svg className="w-24 h-24 text-brandColor/30" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </div>
                            <h3 className="font-poppins text-lg font-semibold text-[#4c494a]">
                                Emma Thompson
                            </h3>
                            <p className="font-nunito text-sm text-brandColor mb-2">
                                Community Manager
                            </p>
                            <p className="font-nunito text-xs text-[#555555] leading-relaxed">
                                Builds bridges between families and babysitters, fostering trust
                                and connection across our growing community.
                            </p>
                        </div>
                        {/* Team Member 4 - Technology */}
                        <div className="text-center group">
                            <div className="aspect-square rounded-full overflow-hidden bg-brandColor/10 mx-auto mb-4 flex items-center justify-center border-4 border-brandColor/20 group-hover:border-brandColor/40 transition-all">
                                <svg className="w-24 h-24 text-brandColor/30" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </div>
                            <h3 className="font-poppins text-lg font-semibold text-[#4c494a]">
                                David Okonkwo
                            </h3>
                            <p className="font-nunito text-sm text-brandColor mb-2">
                                Lead Engineer
                            </p>
                            <p className="font-nunito text-xs text-[#555555] leading-relaxed">
                                Keeps our platform safe, fast, and reliable — because great tech
                                enables great trust.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Trust Statement / CTA */}
            <section className="py-16 bg-brandColor">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="font-poppins text-3xl font-bold text-white mb-4">
                        Ready to Join Our Family?
                    </h2>
                    <p className="font-nunito text-lg text-white/90 max-w-2xl mx-auto mb-8">
                        Whether you're a family seeking care or a babysitter looking for meaningful work,
                        we're here to help you thrive.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/babysitters"
                            className="px-8 py-3 bg-white text-brandColor font-poppins font-semibold rounded-xs hover:bg-gray-100 transition-all"
                        >
                            Find a Babysitter
                        </Link>
                        <Link
                            href="/register-babysitter"
                            className="px-8 py-3 border-2 border-white text-white font-poppins font-semibold rounded-xs hover:bg-white/10 transition-all"
                        >
                            Become a Babysitter
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default page