<script lang="ts">
  import { pricingPlans } from "$lib/pricing_plans"
  import * as Card from "$lib/components/ui/card"
  import { buttonVariants } from "$lib/components/ui/button"

  // Module context
  type Props = {
    highlightedPlanId?: string
    callToAction: string
    currentPlanId?: string
    center?: boolean
  }

  let {
    highlightedPlanId = "",
    callToAction,
    currentPlanId = "",
    center = true,
  }: Props = $props()
</script>

<div
  class="flex flex-col lg:flex-row gap-10 {center
    ? 'place-content-center'
    : ''} flex-wrap"
>
  {#each pricingPlans as plan}
    <Card.Root
      class="{plan.id === highlightedPlanId
        ? 'border-primary'
        : 'border-gray-200'} shadow-xl flex-1 flex-grow min-w-[260px] max-w-[310px] p-6"
    >
      <Card.Content>
        <div class="flex flex-col h-full">
          <div class="text-xl font-bold">{plan.name}</div>
          <p class="mt-2 text-sm text-muted-foreground leading-relaxed">
            {plan.description}
          </p>
          <div class="mt-auto pt-4 text-sm">
            <span class="font-bold">Plan Includes:</span>
            <ul class="list-disc list-inside mt-2 space-y-1">
              {#each plan.features as feature}
                <li class="">{feature}</li>
              {/each}
            </ul>
          </div>
          <div class="pt-8">
            <span class="text-4xl font-bold">{plan.price}</span>
            <span class="text-muted-forground">{plan.priceIntervalName}</span>
            <div class="mt-6 pt-4 flex-1 flex flex-row items-center">
              {#if plan.id === currentPlanId}
                <div
                  class="{buttonVariants({
                    variant: 'outline',
                  })}  no-animation w-[80%] mx-auto cursor-default"
                >
                  Current Plan
                </div>
              {:else}
                <a
                  href={"/account/subscribe/" +
                    (plan?.stripe_price_id ?? "free_plan")}
                  class="{buttonVariants({
                    variant: 'default',
                  })} w-[80%] mx-auto"
                >
                  {callToAction}
                </a>
              {/if}
            </div>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  {/each}
</div>
