<script setup>
import { gradientA, gradientB } from '@/showcase/demoAssets'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
</script>

<template>
  <div v-if="mode !== 'variants'" class="mx-auto max-w-md space-y-1">
    <DzChatBubble side="start" :avatar="gradientA" name="Alex" time="09:41" color="primary">
      Hey! Have you tried the new component showcase?
    </DzChatBubble>
    <DzChatBubble side="end" name="Jamie" time="09:42" color="secondary">
      Yes — the live previews are great. I especially like the source tab.
    </DzChatBubble>
    <DzChatBubble side="start" :avatar="gradientA" name="Alex" time="09:43" footer="Seen">
      Try switching themes while you browse. Everything updates instantly.
    </DzChatBubble>
    <DzChatBubble side="end" name="Jamie" time="09:44" loading />
  </div>

  <div v-else class="grid gap-8 md:grid-cols-2">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Bubble colors</p>
      <div class="space-y-1">
        <DzChatBubble side="start" color="primary">Primary bubble</DzChatBubble>
        <DzChatBubble side="start" color="success">Success bubble</DzChatBubble>
        <DzChatBubble side="end" color="secondary">Secondary bubble</DzChatBubble>
        <DzChatBubble side="end" color="warning">Warning bubble</DzChatBubble>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Headers, footers &amp; loading</p>
      <div class="space-y-1">
        <DzChatBubble side="start" :avatar="gradientB" name="Riley" time="12:01" footer="Delivered">With avatar and footer.</DzChatBubble>
        <DzChatBubble side="end" name="Sam" time="12:02" color="accent">Custom bubble class.</DzChatBubble>
        <DzChatBubble side="start" loading />
      </div>
    </div>
  </div>
</template>
