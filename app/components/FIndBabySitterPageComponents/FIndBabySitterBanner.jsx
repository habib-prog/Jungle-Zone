const FIndBabySitterBanner = ({ category = "babysitting" }) => {
  const labels = { babysitting: "Babysitters", cleaning: "Cleaners", cooking: "Cooks & Chefs" };
  const label = labels[category] || labels.babysitting;
  return (
    <section className="bg-brandColor/10 pt-36 pb-16 px-6 md:px-12 lg:px-24 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Find Local {label}
      </h1>
      <p className="text-base md:text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
        Enter your UK postcode to discover independent {label.toLowerCase()} in your area.
        Browse profiles and connect directly with providers.
      </p>
      <div className="max-w-3xl mx-auto p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 text-left leading-relaxed">
        <strong>Platform Notice:</strong> JungleZone is an online introduction
        platform connecting clients with independent service providers.
        JungleZone does not provide services, employ providers, carry out checks
        or verify qualifications. Service rates are shown before payment, and
        providers set their own hourly rates and arrange service payments directly with customers.
        Clients and providers agree service availability and details directly.
      </div>
    </section>
  );
};

export default FIndBabySitterBanner;
