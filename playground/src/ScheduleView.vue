<template>
    <section class="schedule-playground">
        <div class="schedule-playground__hero">
            <p class="eyebrow">Playground</p>
            <h1>Schedule Playground</h1>
            <p class="hero-copy">
                Esta vista concentra escenarios reales de <strong>ESchedule</strong>
                para revisar cambio de modo, navegación temporal, selección de espacios,
                loading y personalización por slots.
            </p>
        </div>

        <div class="schedule-grid">
            <ECard class="schedule-card" elevation="md">
                <div class="schedule-card__header">
                    <div>
                        <p class="section-kicker">Escenario interactivo</p>
                        <h2>Day, week y schedule</h2>
                    </div>
                    <p class="card-copy">
                        Cambia el modo, avanza la fecha base y selecciona un espacio
                        para comprobar el filtrado y la navegación entre vistas.
                    </p>
                </div>

                <div class="control-toolbar">
                    <div class="pill-group">
                        <button
                            v-for="modeOption in modeOptions"
                            :key="modeOption.value"
                            :class="['pill-button', { 'pill-button--active': scheduleState.mode === modeOption.value }]"
                            type="button"
                            @click="scheduleState.mode = modeOption.value"
                        >
                            {{ modeOption.label }}
                        </button>
                    </div>

                    <div class="pill-group">
                        <button class="pill-button" type="button" @click="moveBaseDate(-1)">
                            Prev
                        </button>
                        <button class="pill-button" type="button" @click="resetBaseDate">
                            Today
                        </button>
                        <button class="pill-button" type="button" @click="moveBaseDate(1)">
                            Next
                        </button>
                    </div>
                </div>

                <div class="control-grid">
                    <label class="control-field">
                        <span>Espacio seleccionado</span>
                        <select v-model="selectedSpaceId">
                            <option
                                v-for="space in spaces"
                                :key="String(space.id)"
                                :value="String(space.id)"
                            >
                                {{ space.label }}
                            </option>
                        </select>
                    </label>

                    <label class="control-field">
                        <span>Columnas en schedule</span>
                        <select v-model.number="scheduleState.scheduleColumn">
                            <option :value="1">1</option>
                            <option :value="2">2</option>
                            <option :value="3">3</option>
                        </select>
                    </label>

                    <label class="control-field control-field--checkbox">
                        <input v-model="scheduleState.loading" type="checkbox" />
                        <span>Loading</span>
                    </label>

                    <label class="control-field control-field--checkbox">
                        <input v-model="scheduleState.scheduleAfterWeek" type="checkbox" />
                        <span>Week → schedule</span>
                    </label>
                </div>

                <div class="schedule-shell">
                    <ESchedule
                        v-model="scheduleState.date"
                        :mode="scheduleState.mode"
                        :selected-space="selectedSpace"
                        :spaces="spaces"
                        :events="scheduleEvents"
                        :loading="scheduleState.loading"
                        :schedule-column="scheduleState.scheduleColumn"
                        :schedule-after-week="scheduleState.scheduleAfterWeek"
                        color="teal-900"
                        row-height="72"
                        :sticky-top-header="8"
                        :start="8 * 60 * 60"
                        :end="18 * 60 * 60"
                        :step="60 * 60"
                        @update:mode="scheduleState.mode = $event"
                        @update:selected-space="handleSelectedSpaceUpdate"
                        @click:event="handleEventClick"
                        @click:empty-slot="handleEmptySlotClick"
                        @click:header-label="handleHeaderClick"
                    />
                </div>
            </ECard>

            <ECard class="schedule-card" elevation="md">
                <div class="schedule-card__header">
                    <div>
                        <p class="section-kicker">Slots</p>
                        <h2>Custom event y empty-slot</h2>
                    </div>
                    <p class="card-copy">
                        Este escenario sirve para revisar cómo se comporta el layout
                        cuando el contenido se personaliza desde el consumidor.
                    </p>
                </div>

                <div class="schedule-shell schedule-shell--compact">
                    <ESchedule
                        :model-value="slotScenario.date"
                        :mode="ScheduleMode.day"
                        :selected-space="slotSelectedSpace"
                        :spaces="spaces"
                        :events="slotScenario.events"
                        color="secondary"
                        row-height="64"
                        :start="9 * 60 * 60"
                        :end="14 * 60 * 60"
                        :step="60 * 60"
                        @click:event="handleEventClick"
                        @click:empty-slot="handleEmptySlotClick"
                    >
                        <template #event="{ event }">
                            <div class="custom-event" :style="slotEventStyle(event)">
                                <strong>{{ event.name }}</strong>
                                <span>{{ event.subtitle }}</span>
                                <em>{{ event.footer }}</em>
                            </div>
                        </template>

                        <template #empty-slot="{ data }">
                            <button class="custom-empty-slot" type="button" @click="emitSyntheticEmptySlot(data)">
                                +
                            </button>
                        </template>
                    </ESchedule>
                </div>
            </ECard>

            <div class="schedule-sidebar">
                <ECard class="schedule-card" elevation="sm">
                    <p class="section-kicker">Estado</p>
                    <h2>Snapshot</h2>
                    <pre class="payload-preview">{{ statePreview }}</pre>
                </ECard>

                <ECard class="schedule-card" elevation="sm">
                    <p class="section-kicker">Interacción</p>
                    <h2>Últimos eventos</h2>
                    <div class="log-list">
                        <div v-for="entry in eventLog" :key="entry.id" class="log-item">
                            <span class="log-item__type">{{ entry.type }}</span>
                            <strong>{{ entry.title }}</strong>
                            <p>{{ entry.detail }}</p>
                        </div>
                    </div>
                </ECard>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";

import ECard from "../../src/components/card/index.vue";
import ESchedule from "../../src/components/schedule/index.vue";
import type { ScheduleEvent, ScheduleSlotEvent, ScheduleSpace } from "../../src/types";
import { ScheduleMode } from "../../src/types";

type ModeOption = {
    label: string;
    value: ScheduleMode;
};

type LogEntry = {
    id: number;
    type: string;
    title: string;
    detail: string;
};

const baseMonday = new Date("2026-03-30T00:00:00");

const spaces: ScheduleSpace[] = [
    { id: "room-a", label: "Room A" },
    { id: "room-b", label: "Room B" },
    { id: "room-c", label: "Room C" },
    { id: "ops", label: "Ops Desk" },
    { id: "remote", label: "Remote" },
];

const scheduleEvents: ScheduleEvent[] = [
    {
        id: "evt-1",
        name: "Design Crit",
        subtitle: "09:00 - 10:00",
        footer: "Room A",
        color: "primary",
        entityId: "room-a",
        start: new Date("2026-03-30T09:00:00"),
        end: new Date("2026-03-30T10:00:00"),
    },
    {
        id: "evt-2",
        name: "Backend Sync",
        subtitle: "11:00 - 13:00",
        footer: "Room A",
        color: "teal-900",
        entityId: "room-a",
        start: new Date("2026-03-30T11:00:00"),
        end: new Date("2026-03-30T13:00:00"),
    },
    {
        id: "evt-3",
        name: "Client Review",
        subtitle: "10:00 - 11:00",
        footer: "Room B",
        color: "secondary",
        entityId: "room-b",
        start: new Date("2026-03-31T10:00:00"),
        end: new Date("2026-03-31T11:00:00"),
    },
    {
        id: "evt-4",
        name: "QA Sweep",
        subtitle: "14:00 - 16:00",
        footer: "Room C",
        color: "cyan-800",
        entityId: "room-c",
        start: new Date("2026-04-01T14:00:00"),
        end: new Date("2026-04-01T16:00:00"),
    },
    {
        id: "evt-5",
        name: "Infra Rotation",
        subtitle: "08:00 - 12:00",
        footer: "Ops Desk",
        color: "error",
        entityId: "ops",
        start: new Date("2026-04-02T08:00:00"),
        end: new Date("2026-04-02T12:00:00"),
    },
    {
        id: "evt-6",
        name: "Remote Planning",
        subtitle: "15:00 - 17:00",
        footer: "Remote",
        color: "teal-300",
        entityId: "remote",
        start: new Date("2026-04-03T15:00:00"),
        end: new Date("2026-04-03T17:00:00"),
    },
];

const slotScenario = {
    date: new Date("2026-03-30T00:00:00"),
    events: [
        {
            id: "slot-1",
            name: "Editorial Review",
            subtitle: "10:00 - 11:00",
            footer: "Custom slot",
            color: "#172033",
            entityId: "room-a",
            start: new Date("2026-03-30T10:00:00"),
            end: new Date("2026-03-30T11:00:00"),
        },
        {
            id: "slot-2",
            name: "Sprint Retro",
            subtitle: "12:00 - 13:00",
            footer: "Secondary slot",
            color: "#0f766e",
            entityId: "room-a",
            start: new Date("2026-03-30T12:00:00"),
            end: new Date("2026-03-30T13:00:00"),
        },
    ] satisfies ScheduleEvent[],
};

const modeOptions: ModeOption[] = [
    { label: "Day", value: ScheduleMode.day },
    { label: "Week", value: ScheduleMode.week },
    { label: "Schedule", value: ScheduleMode.schedule },
];

const scheduleState = reactive({
    date: new Date(baseMonday),
    mode: ScheduleMode.day,
    loading: false,
    scheduleColumn: 2,
    scheduleAfterWeek: true,
});

const slotSelectedSpace = spaces[0];
const selectedSpaceId = ref(String(spaces[0].id));
const eventSequence = ref(0);
const eventLog = ref<LogEntry[]>([]);

const selectedSpace = computed(() => {
    return spaces.find((space) => String(space.id) === selectedSpaceId.value) || spaces[0];
});

const statePreview = computed(() => {
    return JSON.stringify(
        {
            date: scheduleState.date.toISOString(),
            mode: modeOptions.find((item) => item.value === scheduleState.mode)?.label,
            selectedSpace: selectedSpace.value,
            loading: scheduleState.loading,
            scheduleColumn: scheduleState.scheduleColumn,
            scheduleAfterWeek: scheduleState.scheduleAfterWeek,
        },
        null,
        2,
    );
});

const pushLog = (type: string, title: string, detail: string) => {
    eventSequence.value += 1;

    eventLog.value = [
        {
            id: eventSequence.value,
            type,
            title,
            detail,
        },
        ...eventLog.value,
    ].slice(0, 8);
};

const moveBaseDate = (days: number) => {
    const nextDate = new Date(scheduleState.date);
    nextDate.setDate(nextDate.getDate() + days);
    scheduleState.date = nextDate;
};

const resetBaseDate = () => {
    scheduleState.date = new Date(baseMonday);
};

const handleSelectedSpaceUpdate = (value: ScheduleSpace | undefined) => {
    if (!value) return;
    selectedSpaceId.value = String(value.id);
    pushLog("update:selected-space", value.label, `Space id: ${value.id}`);
};

const handleEventClick = ({ data }: { data: ScheduleEvent }) => {
    pushLog("click:event", data.name, `${String(data.entityId)} · ${String(data.subtitle ?? "no subtitle")}`);
};

const handleEmptySlotClick = ({ data }: { data: ScheduleSlotEvent }) => {
    pushLog(
        "click:empty-slot",
        `${String(data.entityId)} · ${new Date(data.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
        `${new Date(data.start).toISOString()} → ${new Date(data.end).toISOString()}`,
    );
};

const handleHeaderClick = ({ date, entityId }: { date: Date; entityId?: number | string }) => {
    pushLog("click:header-label", date.toDateString(), entityId ? `Entity: ${entityId}` : "Calendar header");
};

const emitSyntheticEmptySlot = (data: ScheduleSlotEvent) => {
    handleEmptySlotClick({ data });
};

const slotEventStyle = (event: ScheduleEvent) => ({
    background: String(event.color),
});
</script>

<style scoped>
.schedule-playground {
    display: grid;
    gap: 24px;
}

.schedule-playground__hero {
    display: grid;
    gap: 8px;
    max-width: 820px;
}

.eyebrow,
.section-kicker {
    color: #5b6b8a;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    margin: 0;
    text-transform: uppercase;
}

.schedule-playground__hero h1,
.schedule-card h2 {
    color: #172033;
    margin: 0;
}

.hero-copy,
.card-copy {
    color: #596579;
    line-height: 1.6;
    margin: 0;
}

.schedule-grid {
    display: grid;
    gap: 20px;
    grid-template-columns: minmax(0, 2fr) minmax(0, 2fr) minmax(280px, 1fr);
}

.schedule-sidebar {
    display: grid;
    gap: 16px;
}

.schedule-card {
    border: 1px solid rgba(23, 32, 51, 0.08);
    border-radius: 20px;
    display: grid;
    gap: 18px;
    padding: 24px;
}

.schedule-card__header {
    display: grid;
    gap: 10px;
}

.schedule-shell {
    border: 1px solid rgba(23, 32, 51, 0.08);
    border-radius: 18px;
    overflow: hidden;
    padding: 12px;
}

.schedule-shell--compact {
    min-height: 540px;
}

.control-toolbar,
.control-grid {
    display: grid;
    gap: 12px;
}

.control-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
}

.control-field {
    display: grid;
    gap: 8px;
}

.control-field span {
    color: #51617d;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.control-field select {
    appearance: none;
    background: #fff;
    border: 1px solid rgba(23, 32, 51, 0.12);
    border-radius: 12px;
    color: #172033;
    font: inherit;
    padding: 10px 12px;
}

.control-field--checkbox {
    align-items: center;
    grid-template-columns: auto 1fr;
    padding-top: 24px;
}

.control-field--checkbox input {
    margin: 0;
}

.pill-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.pill-button {
    appearance: none;
    background: rgba(23, 32, 51, 0.05);
    border: 1px solid rgba(23, 32, 51, 0.08);
    border-radius: 999px;
    color: #172033;
    cursor: pointer;
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    padding: 8px 12px;
}

.pill-button--active {
    background: #172033;
    border-color: #172033;
    color: #f8fafc;
}

.custom-event {
    border-radius: 12px;
    color: #fff;
    display: grid;
    gap: 4px;
    height: 100%;
    padding: 8px;
}

.custom-event strong,
.custom-event span,
.custom-event em {
    font-style: normal;
    line-height: 1.2;
}

.custom-empty-slot {
    width: 100%;
    height: 100%;
    appearance: none;
    background: rgba(15, 118, 110, 0.08);
    border: 0;
    color: #0f766e;
    cursor: pointer;
    font: inherit;
    font-size: 18px;
    font-weight: 700;
}

.log-list {
    display: grid;
    gap: 12px;
}

.log-item {
    border: 1px solid rgba(23, 32, 51, 0.08);
    border-radius: 14px;
    padding: 12px;
}

.log-item__type {
    color: #51617d;
    display: block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin-bottom: 4px;
    text-transform: uppercase;
}

.log-item strong {
    color: #172033;
    display: block;
    font-size: 14px;
    margin-bottom: 4px;
}

.log-item p {
    color: #596579;
    line-height: 1.5;
    margin: 0;
}

.payload-preview {
    background: #111827;
    border-radius: 16px;
    color: #d9e2f1;
    font-size: 12px;
    line-height: 1.55;
    margin: 0;
    overflow: auto;
    padding: 16px;
}

@media (max-width: 1280px) {
    .schedule-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 720px) {
    .schedule-card {
        padding: 18px;
    }

    .control-grid {
        grid-template-columns: 1fr;
    }
}
</style>