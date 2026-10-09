<script setup>
import { ref } from 'vue'
import TheHeader from './shared/presentation/components/TheHeader.vue'
import SiteFooter from './shared/presentation/components/SiteFooter.vue'
import FrontendAccessDialog from './shared/presentation/components/FrontendAccessDialog.vue'
import LegalDocument from './shared/presentation/components/LegalDocument.vue'
import TheHero from './value-proposition/presentation/components/TheHero.vue'
import OperationOverview from './value-proposition/presentation/components/OperationOverview.vue'
import AppFeatures from './value-proposition/presentation/components/AppFeatures.vue'
import RentalBenefits from './value-proposition/presentation/components/RentalBenefits.vue'
import ProductShowcase from './value-proposition/presentation/components/ProductShowcase.vue'
import PricingPlans from './value-proposition/presentation/components/PricingPlans.vue'
import ContactUs from './value-proposition/presentation/components/ContactUs.vue'
import OurTeam from './value-proposition/presentation/components/OurTeam.vue'
import AboutRentBuild from './value-proposition/presentation/components/AboutRentBuild.vue'

const accessDialog = ref(null)
const requestedDocument = new URLSearchParams(window.location.search).get('document')
const legalDocument = ['terms', 'privacy'].includes(requestedDocument) ? requestedDocument : null
function openAccess(detail = {}) {
  accessDialog.value.open(detail)
}
</script>

<template>
  <LegalDocument v-if="legalDocument" :document="legalDocument" />
  <div v-else class="landing-page">
    <TheHeader @access="openAccess" />
    <main id="main-content" tabindex="-1">
      <TheHero @access="openAccess" />
      <OperationOverview />
      <AppFeatures />
      <RentalBenefits />
      <ProductShowcase />
      <OurTeam />
      <AboutRentBuild />
      <PricingPlans @access="openAccess" />
      <ContactUs />
    </main>
    <SiteFooter />
    <FrontendAccessDialog ref="accessDialog" />
  </div>
</template>
