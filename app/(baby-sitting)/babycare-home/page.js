import HeroAnimation from '@/animations/HeroAnimation'
import AboutService from '@/app/components/Home/AboutService'
import BabysittersLove from '@/app/components/Home/BabysittersLove'
import Care from '@/app/components/Home/Care'
import FinalCta from '@/app/components/Home/FinalCta'
import Hero from '@/app/components/Home/Hero'
import LocationsHire from '@/app/components/Home/LocationsHire'
import SafetyVerification from '@/app/components/Home/SafetyVerification'
import TestimonialSlider from '@/app/components/Home/TestimonialSlider'
import React from 'react'

const page = () => {
  return (
    <>
      <Hero />
      <AboutService/>
      <Care/>
      <LocationsHire/>
      <BabysittersLove/>
      <TestimonialSlider/>
      <SafetyVerification/>
      <FinalCta/>

    </>
  )
}

export default page