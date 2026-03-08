<template>
  <section class="stack">
    <h1>Component Playground</h1>

    <ECard>
      <ECardContainer class="stack">
        <h3>Buttons</h3>
        <div class="row">
          <EButton color="primary">Primary</EButton>
          <EButton color="secondary" outlined>Outlined</EButton>
          <EButton color="warning">Warning</EButton>
          <EButton color="error" rounded>Danger</EButton>
          <EButton color="brand">Brand</EButton>
        </div>
      </ECardContainer>
    </ECard>

    <ECard>
      <ECardContainer class="stack">
        <h3>List</h3>
        <EList>
          <EListItem>Install Drocket</EListItem>
          <EListItem>Design documentation pages</EListItem>
          <EListItem>Validate runtime theme switching</EListItem>
        </EList>
      </ECardContainer>
    </ECard>
  </section>
</template>

<style scoped>
.stack {
  display: grid;
  gap: 16px;
}

.row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

:global(:root) {
  --e-color-brand: #0284c7;
  --e-contrast-brand: #ffffff;
}
</style>
