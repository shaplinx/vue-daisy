import {
  BellRing,
  Compass,
  LayoutGrid,
  MonitorSmartphone,
  MousePointerClick,
  PanelLeft,
  TextCursorInput,
} from '@lucide/vue'
import type { Component } from 'vue'

export interface ComponentCategory {
  id: string
  label: string
  icon: Component
  description: string
}

export interface RegistryProp {
  name: string
  type: string
  default: string
  description: string
}

export interface RegistryEvent {
  name: string
  payload: string
  description: string
}

export interface RegistrySlot {
  name: string
  description: string
}

export interface RegistryComponent {
  id: string
  name: string
  category: string
  demo: string
  description: string
  props: RegistryProp[]
  events: RegistryEvent[]
  slots: RegistrySlot[]
  source: string
}

export const componentCategories: ComponentCategory[] = [
  {
    id: 'actions',
    label: 'Actions',
    icon: MousePointerClick,
    description: 'Buttons, menus, dialogs and other trigger-based interactions.',
  },
  {
    id: 'data-display',
    label: 'Data Display',
    icon: LayoutGrid,
    description: 'Components that present content, status and structured data.',
  },
  {
    id: 'navigation',
    label: 'Navigation',
    icon: Compass,
    description: 'Wayfinding patterns for moving through the application.',
  },
  {
    id: 'feedback',
    label: 'Feedback',
    icon: BellRing,
    description: 'Communicate loading, progress, alerts and transient messages.',
  },
  {
    id: 'data-input',
    label: 'Data Input',
    icon: TextCursorInput,
    description: 'Accessible form controls with validation and state handling.',
  },
  {
    id: 'layout',
    label: 'Layout',
    icon: PanelLeft,
    description: 'Structural primitives for arranging content and page regions.',
  },
  {
    id: 'mockup',
    label: 'Mockup',
    icon: MonitorSmartphone,
    description: 'Decorative device frames for previews and documentation.',
  },
]

const p = (
  name: string,
  type: string,
  defaultValue: string,
  description: string,
): RegistryProp => ({
  name,
  type,
  default: defaultValue,
  description,
})
const e = (name: string, payload: string, description: string): RegistryEvent => ({
  name,
  payload,
  description,
})
const s = (name: string, description: string): RegistrySlot => ({ name, description })

export const components: RegistryComponent[] = [
  {
    id: 'button',
    name: 'Button',
    category: 'actions',
    demo: 'ButtonDemo',
    description:
      'The primary action component with color, style, size, loading and disabled states. Renders a button, link or router link.',
    props: [
      p('color', 'String', "'default'", 'neutral, primary, secondary, accent, info, success, warning or error'),
      p('variant', 'String', "'solid'", 'solid, outline, ghost, link, soft or dash'),
      p('size', 'String', "'md'", 'xs, sm, md, lg or xl'),
      p('loading', 'Boolean', 'false', 'Shows a spinner and blocks interaction'),
      p('disabled', 'Boolean', 'false', 'Disables the control'),
      p('wide / block / circle / square', 'Boolean', 'false', 'DaisyUI shape modifiers'),
      p('to / href', 'String | Object', 'null', 'Renders a router link or anchor'),
    ],
    events: [e('click', 'MouseEvent', 'Emitted for enabled buttons')],
    slots: [s('default', 'Button label or content'), s('icon', 'Optional leading icon')],
    source: `<DzButton color="primary" @click="save">Save changes</DzButton>

<DzButton variant="outline" color="error" :loading="deleting">
  Delete
</DzButton>`,
  },
  {
    id: 'dropdown',
    name: 'Dropdown',
    category: 'actions',
    demo: 'DropdownDemo',
    description:
      'Accessible popover menu with click or hover triggers, outside-click dismissal, escape handling and arrow-key navigation.',
    props: [
      p('modelValue', 'Boolean', 'undefined', 'Controlled open state (v-model)'),
      p('placement', 'String', "'end'", 'end, top, bottom, left, right or center'),
      p('trigger', 'String', "'click'", 'click or hover'),
      p('closeOnSelect', 'Boolean', 'true', 'Closes after a menu item is selected'),
      p('disabled', 'Boolean', 'false', 'Prevents opening'),
    ],
    events: [
      e('update:modelValue', 'Boolean', 'Open state changed'),
      e('open / close', '—', 'Lifecycle events'),
      e('select', 'Event', 'Emitted when a menu item is chosen'),
    ],
    slots: [s('trigger', 'Custom trigger; receives open/toggle/close'), s('default', 'Menu content; receives close')],
    source: `<DzDropdown placement="end">
  <template #trigger="{ toggle }">
    <DzButton @click="toggle">Actions</DzButton>
  </template>
  <ul class="menu">
    <li><button>Edit</button></li>
    <li><button>Duplicate</button></li>
  </ul>
</DzDropdown>`,
  },
  {
    id: 'fab',
    name: 'FAB / Speed Dial',
    category: 'actions',
    demo: 'FabDemo',
    description:
      'A floating action button that expands into a vertical or flower-shaped speed dial. Supports keyboard focus and item actions.',
    props: [
      p('items', 'Array', '[]', 'Speed-dial actions: { label, icon, color }'),
      p('color', 'String', "'primary'", 'Main button color'),
      p('flower', 'Boolean', 'false', 'Quarter-circle layout'),
      p('modelValue', 'Boolean', 'undefined', 'Controlled open state'),
      p('closeOnAction', 'Boolean', 'true', 'Closes after an action fires'),
    ],
    events: [e('action', '{ item, index, event }', 'A speed-dial action was clicked'), e('open / close', '—', 'Open state changed')],
    slots: [s('default', 'Additional custom actions')],
    source: `<DzFab :items="actions" aria-label="Create">
</DzFab>`,
  },
  {
    id: 'modal',
    name: 'Modal',
    category: 'actions',
    demo: 'ModalDemo',
    description:
      'Native dialog modal with focus trapping, escape and backdrop dismissal, loading state and fully custom header, body and footer slots.',
    props: [
      p('modelValue', 'Boolean', 'false', 'Controlled visibility (v-model)'),
      p('title / description', 'String', "''", 'Default header content'),
      p('size', 'String', "'md'", 'sm, md, lg, xl or full'),
      p('backdropClose / escClose', 'Boolean', 'true', 'Dismiss behaviour'),
      p('loading', 'Boolean', 'false', 'Disables actions in demos'),
    ],
    events: [e('update:modelValue', 'Boolean', 'Visibility changed'), e('close', 'String', 'Reason: escape, backdrop or button'), e('open', '—', 'Dialog opened')],
    slots: [s('header', 'Custom header'), s('default', 'Body content'), s('footer / actions', 'Footer actions')],
    source: `<DzModal v-model="open" title="Edit profile">
  <p>Modal body content.</p>
  <template #footer>
    <DzButton variant="ghost" @click="open = false">Cancel</DzButton>
    <DzButton color="primary" @click="save">Save</DzButton>
  </template>
</DzModal>`,
  },
  {
    id: 'swap',
    name: 'Swap',
    category: 'actions',
    demo: 'SwapDemo',
    description:
      'Toggle between two pieces of content with a rotate or flip animation. Backed by a native checkbox for keyboard and screen-reader support.',
    props: [
      p('modelValue', 'Boolean', 'false', 'Checked state (v-model)'),
      p('animation', 'String', "'rotate'", 'rotate or flip'),
      p('active', 'Boolean', 'false', 'Forces the on state'),
      p('disabled', 'Boolean', 'false', 'Disables the toggle'),
    ],
    events: [e('update:modelValue', 'Boolean', 'State changed'), e('change', 'Boolean', 'Native change event value')],
    slots: [s('on', 'Content shown when checked'), s('off', 'Content shown when unchecked')],
    source: `<DzSwap v-model="on" aria-label="Toggle">
  <template #on><Moon /></template>
  <template #off><Sun /></template>
</DzSwap>`,
  },
  {
    id: 'theme-controller',
    name: 'Theme Controller',
    category: 'actions',
    demo: 'ThemeControllerDemo',
    description:
      'A DaisyUI theme-controller input that switches themes. Works as a checkbox toggle or a radio group for multiple themes.',
    props: [
      p('theme', 'String', "'light'", 'Current theme name'),
      p('type', 'String', "'toggle'", 'toggle or radio'),
      p('lightTheme / darkTheme', 'String', "'light' / 'dark'", 'Themes used by the toggle'),
      p('disabled', 'Boolean', 'false', 'Disables the input'),
    ],
    events: [e('update:modelValue', 'Boolean', 'Toggle state changed'), e('change', 'String, Boolean', 'Selected theme and checked state')],
    slots: [s('on / off', 'Icons or content for each state')],
    source: `<DzThemeController
  type="radio"
  :theme="theme"
  @change="setTheme"
/>`,
  },
  {
    id: 'accordion',
    name: 'Accordion',
    category: 'data-display',
    demo: 'AccordionDemo',
    description:
      'Groups collapsible panels in single-open or multiple-open mode. Content can come from items or scoped slots and remains keyboard accessible.',
    props: [
      p('items', 'Array', '[]', 'Items: { id, title, content, icon }'),
      p('modelValue', 'Array | String | Number', 'undefined', 'Open item id(s)'),
      p('multiple', 'Boolean', 'false', 'Allow several panels to stay open'),
      p('bordered', 'Boolean', 'false', 'Adds a border around panels'),
      p('icon', 'String', "'arrow'", 'arrow, plus or chevron'),
    ],
    events: [e('update:modelValue', 'Array | id', 'Open panels changed'), e('change', 'Array', 'Normalized open ids')],
    slots: [s('title', 'Custom panel header; receives item/index/open'), s('content', 'Custom panel body')],
    source: `<DzAccordion :items="faqs" multiple v-model="open" />`,
  },
  {
    id: 'avatar',
    name: 'Avatar',
    category: 'data-display',
    demo: 'AvatarDemo',
    description:
      'Displays a user or entity image with initials fallback, masks, rings, online/offline status and multiple sizes.',
    props: [
      p('src / alt', 'String', "''", 'Image source and accessible label'),
      p('size', 'String', "'md'", 'xs, sm, md, lg or xl'),
      p('shape', 'String', "'circle'", 'circle, squircle, rounded, square, hexagon or star'),
      p('ring', 'String', "''", 'DaisyUI color ring'),
      p('status', 'String', "''", 'online or offline'),
      p('placeholder', 'String', "''", 'Initials when no image is available'),
    ],
    events: [],
    slots: [],
    source: `<DzAvatar src="/alex.jpg" alt="Alex Morgan" ring="primary" status="online" />`,
  },
  {
    id: 'aura',
    name: 'Aura',
    category: 'data-display',
    demo: 'AuraDemo',
    description:
      'A rotating or glowing border effect that wraps any component. Includes dual, rainbow, holo, gold, silver and glow styles.',
    props: [
      p('variant', 'String', "'border'", 'border, dual, rainbow, holo, gold, silver or glow'),
      p('size', 'String', "'md'", 'xs, sm, md, lg or xl'),
      p('duration', 'Number', 'null', 'Custom animation duration in milliseconds'),
    ],
    events: [],
    slots: [s('default', 'Content to wrap')],
    source: `<DzAura variant="rainbow">
  <DzCard title="Premium">...</DzCard>
</DzAura>`,
  },
  {
    id: 'badge',
    name: 'Badge',
    category: 'data-display',
    demo: 'BadgeDemo',
    description:
      'Compact status labels with all DaisyUI colors, sizes and outline, soft, dash and ghost styles.',
    props: [
      p('color', 'String', "'default'", 'Semantic DaisyUI color'),
      p('size', 'String', "'md'", 'xs, sm, md, lg or xl'),
      p('variant', 'String', "'solid'", 'solid, outline, soft, dash or ghost'),
      p('as', 'String', "'span'", 'Rendered HTML element'),
    ],
    events: [],
    slots: [s('default', 'Badge label'), s('icon', 'Optional icon')],
    source: `<DzBadge color="success" variant="soft">Active</DzBadge>`,
  },
  {
    id: 'card',
    name: 'Card',
    category: 'data-display',
    demo: 'CardDemo',
    description:
      'Flexible content container with image, header, body, footer and action slots. Supports bordered, dash, side and image-full layouts.',
    props: [
      p('title', 'String', "''", 'Default card title'),
      p('image / imageAlt', 'String', "''", 'Optional figure image'),
      p('bordered / dash', 'Boolean', 'false', 'Border styles'),
      p('side', 'Boolean', 'false', 'Horizontal card layout'),
      p('imageFull', 'Boolean', 'false', 'Image covers the whole card'),
      p('size', 'String', "'md'", 'xs, sm, md, lg or xl'),
    ],
    events: [],
    slots: [s('image', 'Custom figure'), s('header', 'Custom header'), s('default', 'Card body'), s('actions / footer', 'Bottom content')],
    source: `<DzCard title="Team plan" bordered>
  <p>Everything your team needs.</p>
  <template #actions>
    <DzButton color="primary">Choose plan</DzButton>
  </template>
</DzCard>`,
  },
  {
    id: 'carousel',
    name: 'Carousel',
    category: 'data-display',
    demo: 'CarouselDemo',
    description:
      'Scroll-snap carousel with previous/next controls, indicators, keyboard arrows and horizontal or vertical orientation.',
    props: [
      p('items', 'Array', '[]', 'Slides: { src, alt, id }'),
      p('modelValue', 'Number', '0', 'Active slide index'),
      p('vertical', 'Boolean', 'false', 'Vertical scrolling'),
      p('showControls / showIndicators', 'Boolean', 'true', 'Optional navigation UI'),
      p('loop', 'Boolean', 'false', 'Wrap around at the ends'),
    ],
    events: [e('update:modelValue', 'Number', 'Active slide changed'), e('change', 'Number', 'Slide index changed')],
    slots: [s('item', 'Custom slide; receives item/index'), s('default', 'Additional slides')],
    source: `<DzCarousel :items="slides" v-model="active" />`,
  },
  {
    id: 'chat',
    name: 'Chat Bubble',
    category: 'data-display',
    demo: 'ChatDemo',
    description:
      'Conversation bubbles with start/end alignment, avatars, author metadata, timestamps, colors and a typing state.',
    props: [
      p('side', 'String', "'start'", 'start or end'),
      p('color', 'String', "'default'", 'Bubble color'),
      p('avatar / name / time', 'String', "''", 'Author metadata'),
      p('loading', 'Boolean', 'false', 'Shows a typing indicator'),
    ],
    events: [],
    slots: [s('avatar', 'Custom avatar'), s('header', 'Custom author row'), s('default', 'Message content'), s('footer', 'Footer metadata')],
    source: `<DzChatBubble side="end" name="You" time="12:04" color="primary">
  See you at 3pm!
</DzChatBubble>`,
  },
  {
    id: 'collapse',
    name: 'Collapse',
    category: 'data-display',
    demo: 'CollapseDemo',
    description:
      'A single expandable panel with controlled state, arrow or plus indicators, optional border and keyboard-friendly header.',
    props: [
      p('modelValue', 'Boolean', 'false', 'Open state (v-model)'),
      p('title', 'String', "''", 'Header text'),
      p('icon', 'String', "'arrow'", 'arrow, plus or none'),
      p('bordered', 'Boolean', 'false', 'Adds a border'),
      p('forceOpen', 'Boolean', 'false', 'Prevents closing'),
      p('disabled', 'Boolean', 'false', 'Disables interaction'),
    ],
    events: [e('update:modelValue', 'Boolean', 'Open state changed'), e('change', 'Boolean', 'Open state changed')],
    slots: [s('title', 'Custom header'), s('default', 'Collapsible content')],
    source: `<DzCollapse v-model="open" title="Shipping details" bordered>
  <p>Orders ship within 2 business days.</p>
</DzCollapse>`,
  },
  {
    id: 'countdown',
    name: 'Countdown',
    category: 'data-display',
    demo: 'CountdownDemo',
    description:
      'Animated numeric countdown display using DaisyUI CSS counters. Useful for timers, offers and event countdowns.',
    props: [
      p('value', 'Number | String', '0', 'Number to display'),
      p('minDigits', 'Number', '1', 'Zero-pad to at least this many digits'),
      p('size', 'String', "'md'", 'xs, sm, md, lg or xl'),
      p('color', 'String', "'default'", 'Semantic text color'),
      p('label', 'String', "''", 'Accessible label override'),
    ],
    events: [],
    slots: [],
    source: `<DzCountdown :value="seconds" :min-digits="2" size="lg" />`,
  },
  {
    id: 'diff',
    name: 'Diff',
    category: 'data-display',
    demo: 'DiffDemo',
    description:
      'Side-by-side image or text comparison with a draggable DaisyUI resizer and keyboard-accessible focus states.',
    props: [
      p('before / after', 'String', "''", 'Image sources'),
      p('beforeAlt / afterAlt', 'String', "'Before' / 'After'", 'Accessible labels'),
      p('aspect', 'String', "'aspect-16/9'", 'Aspect ratio utility'),
      p('label', 'String', "'Image comparison'", 'Figure aria-label'),
    ],
    events: [],
    slots: [s('before', 'Custom before content'), s('after', 'Custom after content')],
    source: `<DzDiff before="/before.jpg" after="/after.jpg" />`,
  },
  {
    id: 'hover-3d',
    name: 'Hover 3D Card',
    category: 'data-display',
    demo: 'Hover3dDemo',
    description:
      'Adds a smooth 3D tilt and light shine to non-interactive content using DaisyUI hover zones.',
    props: [
      p('as', 'String', "'div'", 'Root element type'),
      p('label', 'String', "''", 'Optional aria-label'),
    ],
    events: [],
    slots: [s('default', 'Content to tilt (avoid interactive children)')],
    source: `<DzHover3d>
  <figure class="rounded-2xl"><img src="/card.webp" alt="Card" /></figure>
</DzHover3d>`,
  },
  {
    id: 'hover-gallery',
    name: 'Hover Gallery',
    category: 'data-display',
    demo: 'HoverGalleryDemo',
    description:
      'Displays up to ten images in one frame. Moving horizontally across the gallery reveals each image.',
    props: [
      p('images', 'Array', '[]', 'Image URLs or { src, alt } objects'),
      p('alt', 'String', "'Gallery image'", 'Base alt text'),
      p('width', 'String', "'max-w-60'", 'Maximum width utility'),
      p('rounded', 'Boolean', 'true', 'Rounds and clips the gallery'),
    ],
    events: [],
    slots: [s('default', 'Custom image elements')],
    source: `<DzHoverGallery :images="productImages" />`,
  },
  {
    id: 'kbd',
    name: 'Kbd',
    category: 'data-display',
    demo: 'KbdDemo',
    description:
      'Keyboard shortcut keycaps with color and size variants for documentation and command palettes.',
    props: [
      p('size', 'String', "'md'", 'xs, sm, md, lg or xl'),
      p('color', 'String', "'default'", 'Semantic color'),
      p('as', 'String', "'kbd'", 'Rendered element'),
    ],
    events: [],
    slots: [s('default', 'Key label')],
    source: `<span class="inline-flex gap-1">
  <DzKbd>Ctrl</DzKbd><DzKbd>K</DzKbd>
</span>`,
  },
  {
    id: 'list',
    name: 'List',
    category: 'data-display',
    demo: 'ListDemo',
    description:
      'Vertical list rows with optional avatar or icon, title, description, actions and a wrap modifier.',
    props: [
      p('items', 'Array', '[]', 'Rows: { id, title, description, avatar, icon }'),
      p('wrap', 'Boolean', 'false', 'Allows row content to wrap'),
      p('horizontal', 'Boolean', 'false', 'Horizontal list modifier'),
      p('ariaLabel', 'String', "'List'", 'Accessible list name'),
    ],
    events: [],
    slots: [s('item', 'Full row override; receives item/index'), s('actions', 'Trailing row actions')],
    source: `<DzList :items="members">
  <template #actions="{ item }">
    <DzButton size="xs">View</DzButton>
  </template>
</DzList>`,
  },
  {
    id: 'stat',
    name: 'Stat',
    category: 'data-display',
    demo: 'StatDemo',
    description:
      'Metric blocks for dashboards with title, value, description, icon, color and vertical layout support.',
    props: [
      p('items', 'Array', '[]', 'Stat blocks: { title, value, description, icon, color }'),
      p('title / value / description', 'String', "''", 'Single-stat shorthand'),
      p('icon', 'Component', 'null', 'Figure icon'),
      p('vertical', 'Boolean', 'false', 'Stack stats vertically'),
      p('shadow', 'Boolean', 'false', 'Adds a shadow'),
    ],
    events: [],
    slots: [s('figure / title / value / description / actions', 'Per-stat overrides')],
    source: `<DzStat
  title="Total revenue"
  value="$48,120"
  description="+12% from last month"
/>`,
  },
  {
    id: 'status',
    name: 'Status',
    category: 'data-display',
    demo: 'StatusDemo',
    description:
      'A tiny status dot for online, offline, busy, error and other states, with optional ping animation.',
    props: [
      p('color', 'String', "'default'", 'Semantic status color'),
      p('size', 'String', "'md'", 'xs, sm, md, lg or xl'),
      p('ping', 'Boolean', 'false', 'Adds a ping animation'),
      p('label', 'String', "''", 'Screen-reader label'),
    ],
    events: [],
    slots: [],
    source: `<span class="inline-flex items-center gap-2">
  <DzStatus color="success" ping label="Online" /> Online
</span>`,
  },
  {
    id: 'table',
    name: 'Table',
    category: 'data-display',
    demo: 'TableDemo',
    description:
      'Presentational data table with dynamic columns, scoped cell slots, sorting, selection, loading and empty states.',
    props: [
      p('columns', 'Array', '[]', 'Column definitions: { key, label, sortable, align, formatter }'),
      p('rows', 'Array', '[]', 'Row data'),
      p('zebra / pinRows / pinCols', 'Boolean', 'false', 'DaisyUI table modifiers'),
      p('selectable', 'Boolean', 'false', 'Adds checkbox selection'),
      p('selected', 'Array', '[]', 'Selected row keys (v-model:selected)'),
      p('loading / emptyText', 'Boolean | String', 'false / "No records"', 'State content'),
    ],
    events: [e('update:selected', 'Array', 'Selection changed'), e('row-click', '{ row, index }', 'A row was clicked'), e('sort-change', '{ key, direction }', 'Sort changed')],
    slots: [s('cell-{key}', 'Custom cell; receives row/column/value/index'), s('header-{key}', 'Custom header'), s('empty / footer', 'State and footer content')],
    source: `<DzTable :columns="columns" :rows="users" selectable />`,
  },
  {
    id: 'text-rotate',
    name: 'Text Rotate',
    category: 'data-display',
    demo: 'TextRotateDemo',
    description:
      'Cycles through up to six lines of text with a looping animation that pauses on hover and respects reduced motion.',
    props: [
      p('items', 'Array', '[]', 'Text lines (maximum six)'),
      p('duration', 'Number', '10000', 'Full cycle duration in milliseconds'),
      p('center', 'Boolean', 'false', 'Center each line'),
    ],
    events: [],
    slots: [s('default', 'Custom line elements')],
    source: `<DzTextRotate :items="['Design', 'Develop', 'Deploy']" class="text-4xl" />`,
  },
  {
    id: 'timeline',
    name: 'Timeline',
    category: 'data-display',
    demo: 'TimelineDemo',
    description:
      'Chronological event timeline with icons, dates, descriptions, colors, vertical or horizontal layout and compact mode.',
    props: [
      p('items', 'Array', '[]', 'Events: { date, title, description, icon, color }'),
      p('horizontal', 'Boolean', 'false', 'Horizontal layout'),
      p('compact', 'Boolean', 'false', 'Compact spacing'),
      p('snapIcon', 'Boolean', 'false', 'Snap icons to the start'),
      p('box', 'Boolean', 'true', 'Wrap descriptions in timeline-box'),
    ],
    events: [],
    slots: [s('start / icon / content', 'Custom event parts; receives item/index')],
    source: `<DzTimeline :items="events" />`,
  },
  {
    id: 'breadcrumbs',
    name: 'Breadcrumbs',
    category: 'navigation',
    demo: 'BreadcrumbsDemo',
    description:
      'Hierarchical navigation trail that renders router links, anchors or plain text with accessible current-page state.',
    props: [
      p('items', 'Array', '[]', 'Items: { label, to, href, icon }'),
      p('ariaLabel', 'String', "'Breadcrumb'", 'Accessible name'),
    ],
    events: [],
    slots: [s('item', 'Custom crumb; receives item/index/last')],
    source: `<DzBreadcrumbs :items="[
  { label: 'Home', to: '/' },
  { label: 'Components' },
]" />`,
  },
  {
    id: 'dock',
    name: 'Dock / Bottom Navigation',
    category: 'navigation',
    demo: 'DockDemo',
    description:
      'Fixed bottom navigation bar with icon and label items, active state, badges and responsive sizes.',
    props: [
      p('items', 'Array', '[]', 'Items: { label, icon, to, active, badge }'),
      p('size', 'String', "'md'", 'xs, sm, md, lg or xl'),
      p('ariaLabel', 'String', "'Dock navigation'", 'Accessible name'),
    ],
    events: [],
    slots: [s('default', 'Custom dock items')],
    source: `<DzDock :items="navItems" />`,
  },
  {
    id: 'link',
    name: 'Link',
    category: 'navigation',
    demo: 'LinkDemo',
    description:
      'Underlined links with semantic colors, hover or always-on underlines, external target handling and disabled state.',
    props: [
      p('to / href', 'String | Object', 'null', 'Router or anchor destination'),
      p('color', 'String', "'default'", 'Semantic link color'),
      p('underline', 'String', "'hover'", 'hover, always or none'),
      p('external', 'Boolean', 'false', 'Adds target and rel attributes'),
      p('disabled', 'Boolean', 'false', 'Removes interaction'),
    ],
    events: [e('click', 'MouseEvent', 'Link clicked')],
    slots: [s('default', 'Link text')],
    source: `<DzLink to="/components" color="primary">Browse components</DzLink>`,
  },
  {
    id: 'megamenu',
    name: 'Megamenu',
    category: 'navigation',
    demo: 'MegamenuDemo',
    description:
      'Wide navigation menu with grouped link panels. Opens on hover or click, closes on escape and supports keyboard entry.',
    props: [
      p('items', 'Array', '[]', 'Items: { label, icon, to, groups }'),
      p('openOnHover', 'Boolean', 'true', 'Open panels on pointer hover'),
      p('ariaLabel', 'String', "'Mega menu'", 'Accessible name'),
    ],
    events: [],
    slots: [],
    source: `<DzMegamenu :items="megaItems" />`,
  },
  {
    id: 'menu',
    name: 'Menu',
    category: 'navigation',
    demo: 'MenuDemo',
    description:
      'Vertical or horizontal navigation menu with nested collapsible groups, active highlighting, icons, badges and router links.',
    props: [
      p('items', 'Array', '[]', 'Nested menu items with optional children'),
      p('orientation', 'String', "'vertical'", 'vertical or horizontal'),
      p('size', 'String', "'md'", 'xs, sm, md, lg or xl'),
      p('activeId', 'String | Number', 'null', 'Explicit active item id'),
      p('title', 'String', "''", 'Optional menu title'),
    ],
    events: [e('select', '{ item, event }', 'An item was selected')],
    slots: [s('default', 'Custom menu items')],
    source: `<DzMenu :items="navigation" :active-id="route.name" />`,
  },
  {
    id: 'navbar',
    name: 'Navbar',
    category: 'navigation',
    demo: 'NavbarDemo',
    description:
      'Three-region navigation bar with start, center and end slots plus sticky, bordered and shadow options.',
    props: [
      p('sticky', 'Boolean', 'false', 'Sticks to the top of the viewport'),
      p('bordered', 'Boolean', 'false', 'Adds a bottom border'),
      p('shadow', 'Boolean', 'false', 'Adds a shadow'),
      p('ariaLabel', 'String', "'Main navigation'", 'Accessible name'),
    ],
    events: [],
    slots: [s('start / center / end', 'Navbar regions'), s('default', 'Additional content')],
    source: `<DzNavbar bordered>
  <template #start><strong>Acme</strong></template>
  <template #end><DzButton>Sign in</DzButton></template>
</DzNavbar>`,
  },
  {
    id: 'pagination',
    name: 'Pagination',
    category: 'navigation',
    demo: 'PaginationDemo',
    description:
      'Accessible page navigation with sibling pages, ellipses, first/last and previous/next controls, record counts and size variants.',
    props: [
      p('modelValue', 'Number', '1', 'Current page (v-model)'),
      p('totalPages', 'Number', '1', 'Number of pages'),
      p('total / perPage', 'Number', '0 / 10', 'Record metadata display'),
      p('siblingCount', 'Number', '1', 'Pages shown on each side'),
      p('showEdges / showPrevNext', 'Boolean', 'true', 'Navigation controls'),
    ],
    events: [e('update:modelValue', 'Number', 'Page changed'), e('change', 'Number', 'Page changed'), e('page-change', 'Number', 'Page changed')],
    slots: [],
    source: `<DzPagination
  v-model="page"
  :total-pages="10"
  :total="100"
  :per-page="10"
/>`,
  },
  {
    id: 'steps',
    name: 'Steps',
    category: 'navigation',
    demo: 'StepsDemo',
    description:
      'Visual process steps with completed/current states, descriptions, colors, vertical layout and optional click navigation.',
    props: [
      p('items', 'Array', '[]', 'Steps: { label, description, icon, color, disabled }'),
      p('modelValue', 'Number', '0', 'Current step index (v-model)'),
      p('vertical', 'Boolean', 'false', 'Vertical layout'),
      p('clickable', 'Boolean', 'false', 'Allow navigating by clicking a step'),
      p('color', 'String', "'primary'", 'Completed step color'),
    ],
    events: [e('update:modelValue', 'Number', 'Current step changed'), e('change', 'Number', 'Current step changed')],
    slots: [s('step', 'Custom step; receives item/index/current/complete')],
    source: `<DzSteps :items="steps" v-model="current" clickable />`,
  },
  {
    id: 'tabs',
    name: 'Tabs',
    category: 'navigation',
    demo: 'TabsDemo',
    description:
      'Accessible tab interface with box, border and lift styles, keyboard navigation, controlled or uncontrolled state and named panels.',
    props: [
      p('tabs', 'Array', '[]', 'Tabs: { id, label, icon, badge, disabled }'),
      p('modelValue', 'String | Number', 'undefined', 'Active tab id (v-model)'),
      p('variant', 'String', "'box'", 'box, border or lift'),
      p('size', 'String', "'md'", 'xs, sm, md, lg or xl'),
      p('position', 'String', "'top'", 'top or bottom'),
      p('grow', 'Boolean', 'false', 'Tabs fill available width'),
    ],
    events: [e('update:modelValue', 'String | Number', 'Active tab changed'), e('change', 'Object', 'Active tab object')],
    slots: [s('panel-{id}', 'Panel for a tab id'), s('panel', 'Fallback panel; receives active tab')],
    source: `<DzTabs :tabs="tabs" v-model="active">
  <template #panel-profile>Profile settings</template>
  <template #panel-security>Security settings</template>
</DzTabs>`,
  },
  {
    id: 'alert',
    name: 'Alert',
    category: 'feedback',
    demo: 'AlertDemo',
    description:
      'Inline status messages with semantic colors, outline/soft/dash variants, custom icons, actions and dismissible state.',
    props: [
      p('color', 'String', "'info'", 'Semantic alert color'),
      p('variant', 'String', "'solid'", 'solid, outline, soft or dash'),
      p('title / description', 'String', "''", 'Default content'),
      p('closable', 'Boolean', 'false', 'Shows a dismiss button'),
      p('modelValue', 'Boolean', 'undefined', 'Controlled visibility'),
      p('role', 'String', "'alert'", 'ARIA role'),
    ],
    events: [e('update:modelValue', 'Boolean', 'Visibility changed'), e('close', '—', 'Dismissed')],
    slots: [s('icon / default / actions', 'Custom alert regions')],
    source: `<DzAlert color="success" title="Saved" description="Your changes were saved." closable />`,
  },
  {
    id: 'loading',
    name: 'Loading',
    category: 'feedback',
    demo: 'LoadingDemo',
    description:
      'Animated loading indicators in spinner, dots, ring, ball, bars and infinity styles with sizes and colors.',
    props: [
      p('type', 'String', "'spinner'", 'spinner, dots, ring, ball, bars or infinity'),
      p('size', 'String', "'md'", 'xs, sm, md, lg or xl'),
      p('color', 'String', "'default'", 'Semantic text color'),
      p('text', 'String', "''", 'Visible loading text'),
      p('label', 'String', "'Loading'", 'Accessible label'),
    ],
    events: [],
    slots: [],
    source: `<DzLoading type="dots" size="lg" text="Loading users…" />`,
  },
  {
    id: 'progress',
    name: 'Progress',
    category: 'feedback',
    demo: 'ProgressDemo',
    description:
      'Linear progress bar with determinate and indeterminate modes, semantic colors, sizes and percentage labels.',
    props: [
      p('value / max', 'Number', '0 / 100', 'Progress values'),
      p('color', 'String', "'default'", 'Semantic color'),
      p('size', 'String', "'md'", 'xs, sm, md, lg or xl'),
      p('indeterminate', 'Boolean', 'false', 'Shows an indeterminate bar'),
      p('label / showValue', 'String | Boolean', "'Progress' / false", 'Label and percentage display'),
    ],
    events: [],
    slots: [],
    source: `<DzProgress :value="72" label="Upload" show-value color="primary" />`,
  },
  {
    id: 'radial-progress',
    name: 'Radial Progress',
    category: 'feedback',
    demo: 'RadialProgressDemo',
    description:
      'Circular progress indicator with configurable size, thickness, color and centered slot content.',
    props: [
      p('value / max', 'Number', '0 / 100', 'Progress values'),
      p('size', 'Number | String', '80', 'Diameter in pixels or CSS length'),
      p('thickness', 'Number | String', '8', 'Ring thickness'),
      p('color', 'String', "'primary'", 'Semantic text color'),
      p('showValue', 'Boolean', 'true', 'Shows the percentage'),
    ],
    events: [],
    slots: [s('default', 'Center content')],
    source: `<DzRadialProgress :value="68" :size="96" color="success" />`,
  },
  {
    id: 'skeleton',
    name: 'Skeleton',
    category: 'feedback',
    demo: 'SkeletonDemo',
    description:
      'Shimmering placeholders for text, circles and rectangles, including a multi-line text mode.',
    props: [
      p('variant', 'String', "'rectangle'", 'rectangle, text, circle or avatar'),
      p('lines', 'Number', '1', 'Number of text lines'),
      p('width / height', 'String | Number', "''", 'Dimensions'),
      p('rounded', 'Boolean', 'true', 'Rounds avatar placeholders'),
    ],
    events: [],
    slots: [],
    source: `<DzSkeleton variant="text" :lines="3" />`,
  },
  {
    id: 'toast',
    name: 'Toast',
    category: 'feedback',
    demo: 'ToastDemo',
    description:
      'Stacked notification toasts powered by the useToast composable. Supports success, error, warning and info messages, durations and manual dismissal.',
    props: [
      p('notifications', 'Array', 'null', 'Custom notification list; defaults to useToast state'),
      p('position', 'String', "'bottom-end'", 'top/bottom plus start/center/end'),
      p('max', 'Number', '5', 'Maximum visible toasts'),
    ],
    events: [],
    slots: [s('default', 'Custom toast content')],
    source: `const toast = useToast()
toast.success('Saved successfully', { title: 'Success' })`,
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    category: 'feedback',
    demo: 'TooltipDemo',
    description:
      'Contextual tooltip with placement, color, delay, controlled open state, rich content slot and keyboard focus support.',
    props: [
      p('text', 'String', "''", 'Tooltip text'),
      p('position', 'String', "'top'", 'top, bottom, left, right, start, center or end'),
      p('color', 'String', "'default'", 'Semantic color'),
      p('open', 'Boolean', 'undefined', 'Controlled visibility'),
      p('delay', 'Number', '0', 'Hover delay in milliseconds'),
      p('disabled', 'Boolean', 'false', 'Disables the tooltip'),
    ],
    events: [],
    slots: [s('default', 'Trigger content'), s('content', 'Rich tooltip content')],
    source: `<DzTooltip text="Copy to clipboard" position="bottom">
  <DzButton circle><Copy /></DzButton>
</DzTooltip>`,
  },
  {
    id: 'calendar',
    name: 'Calendar',
    category: 'data-input',
    demo: 'CalendarDemo',
    description:
      'Native date, month, week, time and datetime picker styled with DaisyUI input tokens and an optional label.',
    props: [
      p('modelValue', 'String', "''", 'Selected value (v-model)'),
      p('type', 'String', "'date'", 'date, month, week, time or datetime-local'),
      p('min / max / step', 'String | Number', 'undefined', 'Native input constraints'),
      p('label', 'String', "''", 'Field label'),
      p('size / color', 'String', "'md' / 'default'", 'DaisyUI input modifiers'),
    ],
    events: [e('update:modelValue', 'String', 'Value changed'), e('change', 'Event', 'Native change event')],
    slots: [],
    source: `<DzCalendar v-model="date" label="Start date" />`,
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    category: 'data-input',
    demo: 'CheckboxDemo',
    description:
      'Checkbox with single or array binding, indeterminate state, label, description, sizes and colors.',
    props: [
      p('modelValue', 'Boolean | Array', 'false', 'Checked state or selected values'),
      p('value', 'String | Number | Boolean', 'true', 'Value used in array mode'),
      p('indeterminate', 'Boolean', 'false', 'Mixed state'),
      p('size / color', 'String', "'md' / 'default'", 'DaisyUI modifiers'),
      p('label / description', 'String', "''", 'Inline label content'),
      p('disabled', 'Boolean', 'false', 'Disables the control'),
    ],
    events: [e('update:modelValue', 'Boolean | Array', 'Checked state changed'), e('change', 'Event', 'Native change event')],
    slots: [s('default', 'Custom label content')],
    source: `<DzCheckbox v-model="accepted" label="I accept the terms" color="primary" />`,
  },
  {
    id: 'fieldset',
    name: 'Fieldset',
    category: 'data-input',
    demo: 'FieldsetDemo',
    description:
      'Groups related form controls with a DaisyUI fieldset legend, hint and native disabled propagation.',
    props: [
      p('legend', 'String', "''", 'Group title'),
      p('hint', 'String', "''", 'Helper text'),
      p('disabled', 'Boolean', 'false', 'Disables all child controls'),
    ],
    events: [],
    slots: [s('legend / default / hint', 'Fieldset regions')],
    source: `<DzFieldset legend="Account" hint="We never share your email.">
  <DzInput v-model="email" type="email" />
</DzFieldset>`,
  },
  {
    id: 'file-input',
    name: 'File Input',
    category: 'data-input',
    demo: 'FileInputDemo',
    description:
      'Styled file picker with accept filters, multiple files, selected file list and clear action.',
    props: [
      p('accept', 'String', "''", 'Native accept filter'),
      p('multiple', 'Boolean', 'false', 'Allow multiple files'),
      p('size / color', 'String', "'md' / 'default'", 'DaisyUI modifiers'),
      p('disabled', 'Boolean', 'false', 'Disables the input'),
      p('label', 'String', "'Choose file'", 'Accessible label'),
    ],
    events: [e('change', '{ files, event }', 'Files selected'), e('clear', '—', 'Selection cleared')],
    slots: [],
    source: `<DzFileInput accept="image/*" multiple @change="onFiles" />`,
  },
  {
    id: 'filter',
    name: 'Filter',
    category: 'data-input',
    demo: 'FilterDemo',
    description:
      'A group of icon or text filter buttons with active state and a reset control.',
    props: [
      p('items', 'Array', '[]', 'Filters: { label, value, icon, disabled }'),
      p('modelValue', 'String | Number', "''", 'Selected filter (v-model)'),
      p('showReset', 'Boolean', 'true', 'Shows the reset button'),
      p('resetLabel', 'String', "'Reset filter'", 'Reset button label'),
    ],
    events: [e('update:modelValue', 'String | Number', 'Filter changed'), e('change', 'String | Number', 'Filter changed'), e('reset', '—', 'Filters reset')],
    slots: [],
    source: `<DzFilter v-model="filter" :items="filters" />`,
  },
  {
    id: 'label',
    name: 'Label',
    category: 'data-input',
    demo: 'LabelDemo',
    description:
      'DaisyUI form label with required marker, optional hint and native for association.',
    props: [
      p('text', 'String', "''", 'Label text'),
      p('htmlFor', 'String', 'undefined', 'Associated control id'),
      p('required', 'Boolean', 'false', 'Shows a required marker'),
      p('optional', 'Boolean', 'false', 'Shows an optional hint'),
    ],
    events: [],
    slots: [s('default', 'Custom label content')],
    source: `<DzLabel text="Email" html-for="email" required />`,
  },
  {
    id: 'radio',
    name: 'Radio',
    category: 'data-input',
    demo: 'RadioDemo',
    description:
      'Radio button with shared name grouping, label, description, sizes and semantic colors.',
    props: [
      p('modelValue', 'String | Number | Boolean', "''", 'Selected value (v-model)'),
      p('value', 'String | Number | Boolean', "''", 'This option’s value'),
      p('name', 'String', "'radio'", 'Group name'),
      p('size / color', 'String', "'md' / 'default'", 'DaisyUI modifiers'),
      p('label / description', 'String', "''", 'Inline text'),
      p('disabled', 'Boolean', 'false', 'Disables the option'),
    ],
    events: [e('update:modelValue', 'String | Number | Boolean', 'Selection changed'), e('change', 'Event', 'Native change event')],
    slots: [s('default', 'Custom label content')],
    source: `<DzRadio v-model="plan" name="plan" value="pro" label="Pro" />`,
  },
  {
    id: 'range',
    name: 'Range Slider',
    category: 'data-input',
    demo: 'RangeDemo',
    description:
      'Range slider with min/max/step, semantic colors, sizes, optional value badge and accessible value text.',
    props: [
      p('modelValue', 'Number', '0', 'Current value (v-model)'),
      p('min / max / step', 'Number', '0 / 100 / 1', 'Range constraints'),
      p('size / color', 'String', "'md' / 'primary'", 'DaisyUI modifiers'),
      p('label', 'String', "''", 'Field label'),
      p('showValue', 'Boolean', 'false', 'Shows the numeric value'),
    ],
    events: [e('update:modelValue', 'Number', 'Value changed'), e('input', 'Number', 'Live value'), e('change', 'Number', 'Committed value')],
    slots: [],
    source: `<DzRange v-model="volume" :min="0" :max="100" show-value label="Volume" />`,
  },
  {
    id: 'rating',
    name: 'Rating',
    category: 'data-input',
    demo: 'RatingDemo',
    description:
      'Star rating with configurable maximum, semantic star color, keyboard buttons and click-to-clear support.',
    props: [
      p('modelValue', 'Number', '0', 'Selected rating (v-model)'),
      p('max', 'Number', '5', 'Number of stars'),
      p('size', 'String', "'md'", 'DaisyUI size'),
      p('color', 'String', "'warning'", 'Star color'),
      p('allowClear', 'Boolean', 'true', 'Clicking the current rating clears it'),
      p('readonly', 'Boolean', 'false', 'Prevents changes'),
    ],
    events: [e('update:modelValue', 'Number', 'Rating changed'), e('change', 'Number', 'Rating changed')],
    slots: [],
    source: `<DzRating v-model="score" :max="5" color="warning" />`,
  },
  {
    id: 'select',
    name: 'Select',
    category: 'data-input',
    demo: 'SelectDemo',
    description:
      'Native select with grouped options, placeholder, multiple selection, sizes, colors and validation state.',
    props: [
      p('modelValue', 'String | Number | Array', "''", 'Selected value(s) (v-model)'),
      p('options', 'Array', '[]', 'Options: { label, value, group, disabled }'),
      p('placeholder', 'String', "''", 'Disabled placeholder option'),
      p('multiple', 'Boolean', 'false', 'Multiple selection'),
      p('size / color', 'String', "'md' / 'default'", 'DaisyUI modifiers'),
      p('invalid', 'Boolean', 'false', 'Error styling'),
    ],
    events: [e('update:modelValue', 'String | Number | Array', 'Selection changed'), e('change', 'Event', 'Native change event')],
    slots: [],
    source: `<DzSelect v-model="role" :options="roles" placeholder="Choose a role" />`,
  },
  {
    id: 'input',
    name: 'Text Input',
    category: 'data-input',
    demo: 'InputDemo',
    description:
      'Text input supporting all native types, prefix/suffix slots, clear button, sizes, colors, validation and enter events.',
    props: [
      p('modelValue', 'String | Number', "''", 'Input value (v-model)'),
      p('type', 'String', "'text'", 'Any native input type'),
      p('size / color', 'String', "'md' / 'default'", 'DaisyUI modifiers'),
      p('placeholder', 'String', "''", 'Placeholder text'),
      p('clearable', 'Boolean', 'false', 'Shows a clear button'),
      p('invalid', 'Boolean', 'false', 'Error styling'),
      p('disabled / readonly', 'Boolean', 'false', 'Native states'),
    ],
    events: [e('update:modelValue', 'String', 'Value changed'), e('input / change / focus / blur', 'Event', 'Native events'), e('enter', 'KeyboardEvent', 'Enter pressed'), e('clear', '—', 'Cleared')],
    slots: [s('prefix / suffix', 'Adornments')],
    source: `<DzInput v-model="email" type="email" placeholder="you@example.com" clearable>
  <template #prefix><Mail class="size-4" /></template>
</DzInput>`,
  },
  {
    id: 'textarea',
    name: 'Textarea',
    category: 'data-input',
    demo: 'TextareaDemo',
    description:
      'Multi-line text input with rows, resize control, character count, sizes, colors and validation state.',
    props: [
      p('modelValue', 'String', "''", 'Value (v-model)'),
      p('rows', 'Number', '3', 'Visible rows'),
      p('size / color', 'String', "'md' / 'default'", 'DaisyUI modifiers'),
      p('maxlength / showCount', 'Number | Boolean', 'undefined / false', 'Character limit and counter'),
      p('resize', 'String', "'vertical'", 'none, vertical, horizontal or both'),
      p('invalid', 'Boolean', 'false', 'Error styling'),
    ],
    events: [e('update:modelValue', 'String', 'Value changed'), e('input / change / focus / blur', 'Event', 'Native events')],
    slots: [],
    source: `<DzTextarea v-model="notes" :rows="4" :maxlength="200" show-count />`,
  },
  {
    id: 'toggle',
    name: 'Toggle',
    category: 'data-input',
    demo: 'ToggleDemo',
    description:
      'Switch-style checkbox with label, description, sizes, colors and disabled state.',
    props: [
      p('modelValue', 'Boolean', 'false', 'Checked state (v-model)'),
      p('size / color', 'String', "'md' / 'default'", 'DaisyUI modifiers'),
      p('label / description', 'String', "''", 'Inline text'),
      p('disabled', 'Boolean', 'false', 'Disables the toggle'),
    ],
    events: [e('update:modelValue', 'Boolean', 'State changed'), e('change', 'Event', 'Native change event')],
    slots: [s('default', 'Custom label content')],
    source: `<DzToggle v-model="notifications" label="Email notifications" color="primary" />`,
  },
  {
    id: 'validator',
    name: 'Validator',
    category: 'data-input',
    demo: 'ValidatorDemo',
    description:
      'Native constraint-validation input using DaisyUI validator classes. The hint appears automatically for invalid values.',
    props: [
      p('modelValue', 'String', "''", 'Value (v-model)'),
      p('type', 'String', "'text'", 'Input type'),
      p('required / pattern', 'Boolean | String', 'false / undefined', 'Native constraints'),
      p('minlength / maxlength', 'Number | String', 'undefined', 'Length constraints'),
      p('hint', 'String', "'Please enter a valid value'", 'Validation hint'),
      p('label', 'String', "''", 'Field label'),
    ],
    events: [e('update:modelValue', 'String', 'Value changed'), e('validity', 'Boolean', 'Native validity changed')],
    slots: [s('hint', 'Custom hint content')],
    source: `<DzValidator
  v-model="email"
  type="email"
  required
  label="Email"
  hint="Enter a valid email address"
/>`,
  },
  {
    id: 'otp',
    name: 'OTP',
    category: 'data-input',
    demo: 'OtpDemo',
    description:
      'One-time password input with configurable length, numeric filtering, paste support and a complete event.',
    props: [
      p('modelValue', 'String', "''", 'Code value (v-model)'),
      p('length', 'Number', '6', 'Number of digits'),
      p('size / color', 'String', "'md' / 'default'", 'DaisyUI modifiers'),
      p('joined', 'Boolean', 'false', 'Connect the digit boxes'),
      p('disabled', 'Boolean', 'false', 'Disables input'),
      p('autofocus', 'Boolean', 'false', 'Focuses on mount'),
    ],
    events: [e('update:modelValue', 'String', 'Code changed'), e('change', 'String', 'Code changed'), e('complete', 'String', 'All digits entered')],
    slots: [],
    source: `<DzOtp v-model="code" :length="6" @complete="verify" />`,
  },
  {
    id: 'divider',
    name: 'Divider',
    category: 'layout',
    demo: 'DividerDemo',
    description:
      'Horizontal or vertical separator with optional centered, start or end label and semantic colors.',
    props: [
      p('orientation', 'String', "'horizontal'", 'horizontal or vertical'),
      p('color', 'String', "'default'", 'Semantic color'),
      p('position', 'String', "'start'", 'start, center or end'),
      p('text', 'String', "''", 'Divider label'),
    ],
    events: [],
    slots: [s('default', 'Custom divider label')],
    source: `<DzDivider text="OR" position="center" />`,
  },
  {
    id: 'drawer',
    name: 'Drawer',
    category: 'layout',
    demo: 'DrawerDemo',
    description:
      'Responsive sidebar layout with an overlay on mobile, persistent desktop mode and controlled open state.',
    props: [
      p('modelValue', 'Boolean', 'false', 'Open state (v-model)'),
      p('side', 'String', "'start'", 'start or end'),
      p('responsive', 'String', "'lg'", 'lg, md or none'),
      p('width', 'String', "'w-80'", 'Sidebar width utility'),
    ],
    events: [e('update:modelValue', 'Boolean', 'Open state changed'), e('change', 'Boolean', 'Open state changed')],
    slots: [s('default', 'Main content'), s('sidebar', 'Drawer sidebar content')],
    source: `<DzDrawer v-model="open" side="start">
  <template #sidebar><DzMenu :items="nav" /></template>
  <main>Page content</main>
</DzDrawer>`,
  },
  {
    id: 'footer',
    name: 'Footer',
    category: 'layout',
    demo: 'FooterDemo',
    description:
      'Page footer with horizontal or centered layouts for links, copyright and secondary navigation.',
    props: [
      p('horizontal', 'Boolean', 'false', 'Horizontal footer layout'),
      p('center', 'Boolean', 'false', 'Centers footer content'),
    ],
    events: [],
    slots: [s('default', 'Footer sections and links')],
    source: `<DzFooter horizontal center>
  <aside><p>© 2026 Vue Daisy</p></aside>
  <nav><a href="#">Privacy</a></nav>
</DzFooter>`,
  },
  {
    id: 'hero',
    name: 'Hero',
    category: 'layout',
    demo: 'HeroDemo',
    description:
      'Large hero banner with background image, overlay, configurable minimum height and centered content slot.',
    props: [
      p('image', 'String', "''", 'Background image URL'),
      p('overlay', 'Boolean', 'false', 'Adds a dark overlay'),
      p('minHeight', 'String', "'min-h-[32rem]'", 'Minimum height utility'),
      p('title / description', 'String', "''", 'Default content'),
    ],
    events: [],
    slots: [s('default', 'Hero content'), s('actions', 'Action area')],
    source: `<DzHero image="/hero.jpg" overlay>
  <h1 class="text-5xl font-bold">Build faster</h1>
</DzHero>`,
  },
  {
    id: 'indicator',
    name: 'Indicator',
    category: 'layout',
    demo: 'IndicatorDemo',
    description:
      'Places a badge or custom element on the corner of another element with flexible placement.',
    props: [
      p('badge', 'String | Number', "''", 'Badge content'),
      p('color', 'String', "'primary'", 'Badge color'),
      p('placement', 'String', "'top-end'", 'top/bottom, start/end, center or middle'),
      p('size', 'String', "'md'", 'Badge size'),
    ],
    events: [],
    slots: [s('default', 'Base content'), s('indicator', 'Custom indicator')],
    source: `<DzIndicator badge="3" color="error">
  <DzButton circle><Bell /></DzButton>
</DzIndicator>`,
  },
  {
    id: 'join',
    name: 'Join',
    category: 'layout',
    demo: 'JoinDemo',
    description:
      'Groups buttons, inputs or other items into a single joined control with shared borders and corner radii.',
    props: [
      p('vertical', 'Boolean', 'false', 'Vertical grouping'),
      p('size', 'String', "'md'", 'Join size modifier'),
    ],
    events: [],
    slots: [s('default', 'Joined items (add join-item)')],
    source: `<DzJoin>
  <button class="btn join-item">Left</button>
  <button class="btn join-item">Right</button>
</DzJoin>`,
  },
  {
    id: 'mask',
    name: 'Mask',
    category: 'layout',
    demo: 'MaskDemo',
    description:
      'Crops images or content into DaisyUI shapes such as squircle, heart, hexagon, star and triangle.',
    props: [
      p('shape', 'String', "'squircle'", 'DaisyUI mask shape'),
      p('src / alt', 'String', "''", 'Image source and alt text'),
      p('size', 'String', "'w-24'", 'Size utility'),
    ],
    events: [],
    slots: [s('default', 'Custom masked content')],
    source: `<DzMask shape="hexagon" src="/avatar.jpg" alt="Avatar" size="w-32" />`,
  },
  {
    id: 'stack',
    name: 'Stack',
    category: 'layout',
    demo: 'StackDemo',
    description:
      'Visually stacks child elements with offset edges in a chosen direction.',
    props: [
      p('direction', 'String', "'top'", 'top, bottom, start or end'),
      p('as', 'String', "'div'", 'Rendered element'),
    ],
    events: [],
    slots: [s('default', 'Elements to stack')],
    source: `<DzStack>
  <div class="card bg-base-100">Card one</div>
  <div class="card bg-base-100">Card two</div>
</DzStack>`,
  },
  {
    id: 'mockup-browser',
    name: 'Browser Mockup',
    category: 'mockup',
    demo: 'BrowserMockupDemo',
    description:
      'Browser chrome frame with an address bar for screenshots and website previews.',
    props: [
      p('url', 'String', "'https://daisyui.com'", 'Address bar text'),
      p('bordered', 'Boolean', 'true', 'Adds a border'),
      p('contentClass', 'String | Array | Object', "''", 'Content area classes'),
    ],
    events: [],
    slots: [s('default', 'Browser content')],
    source: `<DzBrowserMockup url="https://example.com">
  <img src="/preview.png" alt="Website preview" />
</DzBrowserMockup>`,
  },
  {
    id: 'mockup-code',
    name: 'Code Mockup',
    category: 'mockup',
    demo: 'CodeMockupDemo',
    description:
      'Code editor frame with line prefixes and optional per-line classes for syntax highlighting.',
    props: [
      p('lines', 'Array', '[]', 'Strings or { text, prefix, class } objects'),
      p('prefix', 'String', "'$'", 'Default line prefix'),
      p('contentClass', 'String | Array | Object', "''", 'Frame classes'),
    ],
    events: [],
    slots: [s('default', 'Custom pre elements')],
    source: `<DzCodeMockup :lines="[
  'npm install',
  'npm run dev',
]" />`,
  },
  {
    id: 'mockup-phone',
    name: 'Phone Mockup',
    category: 'mockup',
    demo: 'PhoneMockupDemo',
    description:
      'iPhone-style device frame with camera notch and display area for mobile previews.',
    props: [p('contentClass', 'String | Array | Object', "''", 'Display area classes')],
    events: [],
    slots: [s('default', 'Phone screen content')],
    source: `<DzPhoneMockup>
  <img src="/mobile.png" alt="Mobile app" />
</DzPhoneMockup>`,
  },
  {
    id: 'mockup-window',
    name: 'Window Mockup',
    category: 'mockup',
    demo: 'WindowMockupDemo',
    description:
      'Desktop window frame for app screenshots, with optional border and custom content styling.',
    props: [
      p('bordered', 'Boolean', 'true', 'Adds a border'),
      p('contentClass', 'String | Array | Object', "''", 'Content area classes'),
    ],
    events: [],
    slots: [s('default', 'Window content')],
    source: `<DzWindowMockup>
  <img src="/dashboard.png" alt="Dashboard preview" />
</DzWindowMockup>`,
  },
]

export const componentsById: Record<string, RegistryComponent> = Object.fromEntries(
  components.map((component) => [component.id, component]),
)

export function componentsByCategory(categoryId: string): RegistryComponent[] {
  return components.filter((component) => component.category === categoryId)
}
