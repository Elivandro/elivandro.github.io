<script setup>
import { computed, ref } from 'vue'

const MIN_ODD = 1.1
const HOUSE_PROFIT_BUFFER = 5.0

const form = ref({
    odd: 1.7,
    rounds: 5,
    playerOne: {
        name: 'José',
        choice: 'PAR',
        bet: 100,
    },
    playerTwo: {
        name: 'João',
        choice: 'IMPAR',
        bet: 100,
    },
})

const history = ref([])
const isRolling = ref(false)
const feedback = ref('')

const oddNumber = computed(() => normalizeNumber(form.value.odd))
const maxBet = computed(() => Math.max(normalizeNumber(form.value.playerOne.bet), normalizeNumber(form.value.playerTwo.bet)))
const totalBets = computed(() => normalizeNumber(form.value.playerOne.bet) + normalizeNumber(form.value.playerTwo.bet))

const maxSafeOdd = computed(() => {
    if (maxBet.value <= 0) return 0
    return totalBets.value / maxBet.value
})

const maxProfitableOdd = computed(() => {
    if (maxSafeOdd.value <= 0) return 0

    const safeOdd = maxSafeOdd.value - HOUSE_PROFIT_BUFFER / maxBet.value
    return Math.max(0, Math.floor((safeOdd + Number.EPSILON) * 100) / 100)
})

const isOddValid = computed(() => (
    maxProfitableOdd.value >= MIN_ODD &&
    oddNumber.value >= MIN_ODD &&
    oddNumber.value <= maxProfitableOdd.value
))
const arePlayersValid = computed(() => {
    const p1 = form.value.playerOne
    const p2 = form.value.playerTwo

    return (
        p1.name.trim().length > 0 &&
        p2.name.trim().length > 0 &&
        normalizeNumber(p1.bet) > 0 &&
        normalizeNumber(p2.bet) > 0 &&
        p1.choice !== p2.choice
    )
})
const canLaunch = computed(() => isOddValid.value && arePlayersValid.value && !isRolling.value)
const roundCount = computed(() => history.value.length)
const currentOdd = computed(() => Math.max(MIN_ODD, oddNumber.value || MIN_ODD))
const houseProfit = computed(() => history.value.reduce((sum, r) => sum + r.houseProfit, 0))
const latestReading = computed(() => {
    const latest = history.value[0]
    if (!latest) return 'Aguardando lançamento'
    return `${latest.outcome} · dado ${latest.die}`
})

const playerSummaries = computed(() => {
    return [form.value.playerOne, form.value.playerTwo].map((player, idx) => {
        const results = history.value.map((r) => (idx === 0 ? r.playerOne : r.playerTwo))
        const totalBet = results.reduce((sum, res) => sum + res.bet, 0)
        const profit = results.reduce((sum, res) => sum + res.profit, 0)
        const loss = results.reduce((sum, res) => sum + res.loss, 0)
        const wins = results.filter((res) => res.won).length
        const defeats = results.length - wins

        return {
            name: player.name.trim() || `Apostador ${idx + 1}`,
            choice: player.choice,
            totalBet,
            profit,
            loss,
            wins,
            defeats,
            net: profit - loss,
            balance: totalBet + profit - loss,
        }
    })
})

const oddMessage = computed(() => {
    if (!form.value.odd && form.value.odd !== 0) return 'Digite uma odd para iniciar.'
    if (oddNumber.value < MIN_ODD) return 'A odd mínima para este exercício é 1,10.'
    if (maxProfitableOdd.value < MIN_ODD) return 'As apostas estão muito desequilibradas para manter a odd mínima com lucro. Aumente a menor aposta.'
    if (oddNumber.value > maxProfitableOdd.value) return `Para manter lucro positivo, a odd máxima atual é ${formatOdd(maxProfitableOdd.value)}.`
    return `Regra ativa: odd entre 1,10 e ${formatOdd(maxProfitableOdd.value)}, com margem positiva para a banca.`
})

const configurationMessage = computed(() => {
    const p1 = form.value.playerOne
    const p2 = form.value.playerTwo
    if (!p1.name.trim() || !p2.name.trim()) return 'Informe o nome dos dois apostadores.'
    if (normalizeNumber(p1.bet) <= 0 || normalizeNumber(p2.bet) <= 0) return 'Os valores apostados precisam ser maiores que zero.'
    if (p1.choice === p2.choice) return 'Para comparar os resultados, cada jogador precisa escolher um lado diferente.'
    return ''
})

function normalizeNumber(val) {
    const num = Number(String(val ?? '').replace(',', '.'))
    return Number.isFinite(num) ? num : 0
}

function formatCurrency(val) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0)
}

function formatOdd(val) {
    return normalizeNumber(val).toFixed(2).replace('.', ',')
}

function signedCurrency(val) {
    return `${val >= 0 ? '+' : '−'} ${formatCurrency(Math.abs(val))}`
}

function validateAndClampOdd() {
    if (oddNumber.value < MIN_ODD) form.value.odd = MIN_ODD
    if (maxProfitableOdd.value >= MIN_ODD && oddNumber.value > maxProfitableOdd.value) {
        form.value.odd = Number(maxProfitableOdd.value.toFixed(2))
    }
}

function createPlayerResult(player, outcome) {
    const bet = normalizeNumber(player.bet)
    const won = player.choice === outcome
    const profit = won ? bet * (currentOdd.value - 1) : 0
    const loss = won ? 0 : bet

    return {
        name: player.name.trim(),
        choice: player.choice,
        bet,
        won,
        profit,
        loss,
        returnAmount: won ? bet * currentOdd.value : 0,
    }
}

function createRound(roundNum) {
    const die = Math.floor(Math.random() * 6) + 1
    const outcome = die % 2 === 0 ? 'PAR' : 'IMPAR'
    const p1 = createPlayerResult(form.value.playerOne, outcome)
    const p2 = createPlayerResult(form.value.playerTwo, outcome)
    const winner = p1.won ? p1 : p2
    const loser = p1.won ? p2 : p1

    const totalArrecadado = loser.bet + winner.bet
    const pagamentoVencedor = winner.bet + winner.profit
    // A validação dinâmica da odd impede resultado negativo. O clamp abaixo
    // protege contra diferenças de ponto flutuante nos valores monetários.
    const houseProfit = Math.max(0, Number((totalArrecadado - pagamentoVencedor).toFixed(2)))

    return {
        id: `${Date.now()}-${roundNum}-${Math.random()}`,
        round: roundNum,
        die,
        outcome,
        odd: currentOdd.value,
        playerOne: p1,
        playerTwo: p2,
        houseProfit,
    }
}

function delay(ms) {
    return new Promise((res) => window.setTimeout(res, ms))
}

async function runSimulation() {
    if (!canLaunch.value) return

    isRolling.value = true
    feedback.value = ''
    const target = Math.max(1, Math.min(500, Math.round(normalizeNumber(form.value.rounds) || 1)))

    for (let i = 0; i < target; i++) {
        const round = createRound(history.value.length + 1)
        history.value.unshift(round)
        await delay(80)
    }

    isRolling.value = false
    feedback.value = `${target} ${target === 1 ? 'rodada registrada' : 'rodadas registradas'} com sucesso.`
}

function resetSimulation() {
    history.value = []
    feedback.value = 'Histórico limpo. Pronto para novos parâmetros.'
}
</script>

<template>
    <div
        class="min-h-screen w-full overflow-x-hidden bg-[#f4f0e7] text-[#173d42] font-['DM_Sans',sans-serif] antialiased selection:bg-[#e96b4b]/30">
        <div class="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-10 min-h-screen flex flex-col justify-between">

            <!-- Topbar -->
            <header class="py-5 sm:py-7 flex flex-wrap items-center justify-between gap-4 border-b border-[#173d42]/15">
                <a class="inline-flex items-center gap-3 no-underline text-inherit group" href="#top">
                    <div
                        class="w-10 h-10 grid place-items-center bg-[#e96b4b] rounded-[11px_11px_11px_4px] rotate-[-7deg] shadow-md transition-transform group-hover:rotate-0">
                        <svg viewBox="0 0 32 32" width="20" height="20" fill="none" class="rotate-[7deg]">
                            <rect width="32" height="32" rx="8" fill="currentColor" />
                            <circle cx="11" cy="11" r="3" fill="#fffdf8" />
                            <circle cx="21" cy="21" r="3" fill="#fffdf8" />
                        </svg>
                    </div>
                    <div class="grid gap-0.5">
                        <span
                            class="font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.16em] font-semibold text-[#e96b4b]">Simulador</span>
                        <span class="font-['Fraunces',Georgia,serif] text-lg font-bold leading-tight">Apostas com
                            Dado</span>
                    </div>
                </a>
                <div
                    class="inline-flex max-w-full items-center gap-2 text-[#597174] font-['IBM_Plex_Mono'] text-[9px] sm:text-[10px] uppercase tracking-[0.08em]">
                    <span
                        class="w-2 h-2 inline-block bg-[#3f775e] rounded-full shadow-[0_0_0_4px_rgba(63,119,94,0.12)]"></span>
                    <span class="break-words">Uso didático &amp; estatístico</span>
                </div>
            </header>

            <!-- Hero Section -->
            <section id="top"
                class="py-10 sm:py-12 lg:py-16 grid lg:grid-cols-[0.98fr_1.02fr] gap-8 lg:gap-12 items-center">
                <div class="max-w-[630px] relative z-10">
                    <p
                        class="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.08em] font-semibold text-[#e96b4b] mb-5">
                        Simulador interativo <span class="text-[#597174] ml-3">Par &amp; Ímpar</span>
                    </p>
                    <h1
                        class="font-['Fraunces',Georgia,serif] text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.07em] leading-[0.92] text-[#102f34] m-0">
                        A matemática<br /><em class="text-[#e96b4b] not-italic">da casa.</em>
                    </h1>
                    <p class="text-[#597174] text-base leading-[1.7] max-w-[510px] mt-7">
                        Explore como apostadores com escolhas opostas interagem com o lançamento de um dado e descubra
                        como a odd define a margem da banca. O limite é calculado a partir dos valores apostados para
                        que o pagamento máximo permaneça abaixo da arrecadação total.
                    </p>
                    <div
                        class="max-w-[510px] mt-8 sm:mt-10 pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8 border-t border-[#173d42]/15">
                        <div class="grid gap-1">
                            <span
                                class="font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.08em] text-[#597174]">Mecânica</span>
                            <strong class="font-['IBM_Plex_Mono'] text-xs font-semibold text-[#173d42]">Dado de 6
                                faces</strong>
                        </div>
                        <div class="grid gap-1">
                            <span
                                class="font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.08em] text-[#597174]">Limite
                                de Odd</span>
                            <strong class="font-['IBM_Plex_Mono'] text-xs font-semibold text-[#173d42]">1,10 a
                                {{ formatOdd(Math.max(MIN_ODD, maxProfitableOdd)) }}</strong>
                        </div>
                        <div class="grid gap-1">
                            <span
                                class="font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.08em] text-[#597174]">Objetivo</span>
                            <strong class="font-['IBM_Plex_Mono'] text-xs font-semibold text-[#173d42]">Análise
                                didática</strong>
                        </div>
                    </div>
                </div>

                <div
                    class="relative min-h-[280px] sm:min-h-[365px] overflow-hidden bg-[#102f34] shadow-[12px_18px_0_rgba(233,107,75,0.14)] sm:shadow-[20px_28px_0_rgba(233,107,75,0.14)] rounded-xl p-5 sm:p-8 flex flex-col justify-end text-[#fffdf8]">
                    <div class="absolute inset-3 border border-[#fffdf8]/20 pointer-events-none rounded-lg"></div>
                    <div class="relative z-10 max-w-[230px]">
                        <span
                            class="font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.08em] text-[#f2a08b] block mb-2">Ref
                            / 01</span>
                        <p class="text-sm leading-relaxed m-0 text-[#f4f0e7]">
                            Arrecadação total menos pagamento ao vencedor = lucro da casa. ODD 2,0 gera lucro zero
                            (justo).
                        </p>
                    </div>
                </div>
            </section>

            <!-- Workspace -->
            <section class="grid gap-6 lg:grid-cols-[340px_1fr] lg:gap-7 items-start pb-12 sm:pb-20">

                <!-- Control Panel (Sidebar) -->
                <aside
                    class="bg-[#fffdf8] border border-[#173d42]/11 shadow-[0_10px_32px_rgba(35,49,44,0.08)] p-5 sm:p-7 rounded-[5px_24px_24px_24px] lg:sticky lg:top-6">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <p
                                class="font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.08em] font-semibold text-[#e96b4b] mb-2">
                                01 / Parâmetros</p>
                            <h2
                                class="font-['Fraunces',Georgia,serif] text-2xl font-semibold text-[#102f34] tracking-[-0.045em] m-0">
                                Configuração</h2>
                        </div>
                        <span
                            class="font-['IBM_Plex_Mono'] text-[8px] uppercase tracking-[0.08em] font-semibold px-2 py-1 text-[#e96b4b] border border-[#e96b4b]/45 rotate-2">EDITÁVEL</span>
                    </div>

                    <p class="text-[#597174] text-xs leading-relaxed my-4">
                        Defina os nomes, os lados escolhidos, os valores por rodada e uma odd entre 1,1 e o limite
                        calculado para manter lucro positivo.
                    </p>

                    <!-- Player 1 -->
                    <div class="py-4 border-t border-[#173d42]/15">
                        <div class="flex items-center justify-between mb-3">
                            <span
                                class="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-[0.08em] font-semibold text-[#173d42]">Apostador
                                1</span>
                            <span
                                class="font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.08em] text-[#597174]">A</span>
                        </div>
                        <label
                            class="grid gap-1.5 font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.04em] text-[#597174]">
                            <span>Nome</span>
                            <input v-model.trim="form.playerOne.name" type="text" maxlength="32"
                                class="w-full min-h-[40px] px-3 bg-[#faf8f2] border border-[#173d42]/20 rounded text-sm text-[#173d42] font-sans focus:bg-white focus:border-[#e96b4b] focus:outline-none focus:ring-2 focus:ring-[#e96b4b]/20" />
                        </label>
                        <div class="grid grid-cols-1 sm:grid-cols-[0.8fr_1.2fr] gap-2.5 mt-3">
                            <label
                                class="grid gap-1.5 font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.04em] text-[#597174]">
                                <span>Escolha</span>
                                <select v-model="form.playerOne.choice"
                                    class="w-full min-h-[40px] px-3 bg-[#faf8f2] border border-[#173d42]/20 rounded text-sm text-[#173d42] font-sans focus:bg-white focus:border-[#e96b4b] focus:outline-none">
                                    <option value="PAR">PAR</option>
                                    <option value="IMPAR">ÍMPAR</option>
                                </select>
                            </label>
                            <label
                                class="grid gap-1.5 font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.04em] text-[#597174]">
                                <span>Valor por rodada</span>
                                <div class="relative">
                                    <span
                                        class="absolute left-3 top-1/2 -translate-y-1/2 font-['IBM_Plex_Mono'] text-[11px] text-[#597174]">R$</span>
                                    <input v-model.number="form.playerOne.bet" type="number" min="0.01" step="0.01"
                                        class="w-full min-h-[40px] pl-9 pr-3 bg-[#faf8f2] border border-[#173d42]/20 rounded text-sm text-[#173d42] font-sans focus:bg-white focus:border-[#e96b4b] focus:outline-none" />
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- Player 2 -->
                    <div class="py-4 border-t border-[#173d42]/15">
                        <div class="flex items-center justify-between mb-3">
                            <span
                                class="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-[0.08em] font-semibold text-[#173d42]">Apostador
                                2</span>
                            <span
                                class="font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.08em] text-[#597174]">B</span>
                        </div>
                        <label
                            class="grid gap-1.5 font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.04em] text-[#597174]">
                            <span>Nome</span>
                            <input v-model.trim="form.playerTwo.name" type="text" maxlength="32"
                                class="w-full min-h-[40px] px-3 bg-[#faf8f2] border border-[#173d42]/20 rounded text-sm text-[#173d42] font-sans focus:bg-white focus:border-[#e96b4b] focus:outline-none" />
                        </label>
                        <div class="grid grid-cols-1 sm:grid-cols-[0.8fr_1.2fr] gap-2.5 mt-3">
                            <label
                                class="grid gap-1.5 font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.04em] text-[#597174]">
                                <span>Escolha</span>
                                <select v-model="form.playerTwo.choice"
                                    class="w-full min-h-[40px] px-3 bg-[#faf8f2] border border-[#173d42]/20 rounded text-sm text-[#173d42] font-sans focus:bg-white focus:border-[#e96b4b] focus:outline-none">
                                    <option value="PAR">PAR</option>
                                    <option value="IMPAR">ÍMPAR</option>
                                </select>
                            </label>
                            <label
                                class="grid gap-1.5 font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.04em] text-[#597174]">
                                <span>Valor por rodada</span>
                                <div class="relative">
                                    <span
                                        class="absolute left-3 top-1/2 -translate-y-1/2 font-['IBM_Plex_Mono'] text-[11px] text-[#597174]">R$</span>
                                    <input v-model.number="form.playerTwo.bet" type="number" min="0.01" step="0.01"
                                        class="w-full min-h-[40px] pl-9 pr-3 bg-[#faf8f2] border border-[#173d42]/20 rounded text-sm text-[#173d42] font-sans focus:bg-white focus:border-[#e96b4b] focus:outline-none" />
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- Odd rule -->
                    <div class="py-4 border-t border-[#173d42]/15">
                        <div class="flex items-center justify-between mb-3">
                            <span
                                class="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-[0.08em] font-semibold text-[#173d42]">Regra
                                da banca</span>
                            <span
                                class="font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.08em] font-semibold text-[#e96b4b]">01</span>
                        </div>
                        <label
                            class="grid gap-1.5 font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.04em] text-[#597174]">
                            <span>Odd (1,10 a {{ formatOdd(Math.max(MIN_ODD, maxProfitableOdd)) }})</span>
                            <div class="relative" :class="{ 'ring-1 ring-[#b25745] rounded': !isOddValid }">
                                <input v-model.number="form.odd" type="number" :min="MIN_ODD"
                                    :max="Math.max(MIN_ODD, maxProfitableOdd)" step="0.05" @blur="validateAndClampOdd"
                                    class="w-full min-h-[40px] pl-3 pr-8 bg-[#fff8f4] border border-[#e96b4b] rounded text-base font-['IBM_Plex_Mono'] font-semibold text-[#102f34] focus:outline-none" />
                                <span
                                    class="absolute right-3 top-1/2 -translate-y-1/2 font-['IBM_Plex_Mono'] text-sm text-[#e96b4b]">×</span>
                            </div>
                        </label>
                        <p class="mt-2 text-[9px] font-['IBM_Plex_Mono'] uppercase tracking-[0.03em] leading-relaxed"
                            :class="isOddValid ? 'text-[#3f775e]' : 'text-[#b25745]'">
                            {{ oddMessage }}
                        </p>
                    </div>

                    <!-- Formula Info Box -->
                    <div
                        class="flex gap-2.5 my-3 p-3 bg-[#edf3ed] border border-[#3f775e]/22 border-l-[3px] border-l-[#3f775e] text-[#597174]">
                        <div
                            class="w-4 h-4 rounded-full border border-currentColor grid place-items-center text-[#3f775e] font-['IBM_Plex_Mono'] text-[10px] font-semibold shrink-0">
                            ℹ</div>
                        <p class="m-0 font-['IBM_Plex_Mono'] text-[9px] leading-relaxed text-[#173d42]">
                            <strong>Limite de segurança:</strong> o sistema calcula a maior odd possível a partir das
                            apostas. O pagamento máximo deve ficar abaixo da arrecadação total; assim, a casa mantém
                            pelo menos R$ 0,01 de margem por rodada, mesmo se qualquer jogador vencer.
                        </p>
                    </div>

                    <div v-if="configurationMessage"
                        class="flex gap-2.5 p-3 mb-4 bg-[#f4dfda] border-l-[3px] border-[#b25745] text-[#b25745] text-xs leading-snug rounded"
                        role="alert">
                        <span
                            class="w-4 h-4 rounded-full border border-currentColor grid place-items-center font-['IBM_Plex_Mono'] text-[10px] shrink-0">!</span>
                        <p class="m-0">{{ configurationMessage }}</p>
                    </div>

                    <!-- Actions -->
                    <div class="grid gap-3 pt-2">
                        <button
                            class="w-full min-h-[44px] px-5 bg-[#e96b4b] hover:bg-[#d85a3a] text-[#fffdf8] font-['IBM_Plex_Mono'] text-xs font-semibold uppercase tracking-[0.08em] rounded flex items-center justify-between transition-colors shadow-sm disabled:opacity-55 disabled:cursor-not-allowed"
                            type="button" :disabled="!canLaunch" @click="runSimulation">
                            <span>{{ isRolling ? 'Simulando…' : `Executar ${Math.max(1,
                                Math.round(normalizeNumber(form.rounds) || 1))} rodadas` }}</span>
                            <span class="text-base">↗</span>
                        </button>
                        <div class="grid grid-cols-2 gap-2">
                            <label
                                class="grid gap-1 font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.08em] text-[#597174]">
                                <span>Qtde rodadas</span>
                                <input v-model.number="form.rounds" type="number" min="1" max="500" step="1"
                                    class="w-full min-h-[38px] px-2 bg-[#faf8f2] border border-[#173d42]/20 rounded text-sm text-[#173d42] font-sans focus:bg-white focus:border-[#e96b4b] focus:outline-none" />
                            </label>
                            <button
                                class="self-end min-h-[38px] px-3 bg-[#e9e2d4] hover:bg-[#ded5c2] text-[#173d42] font-['IBM_Plex_Mono'] text-[9px] font-semibold uppercase tracking-[0.08em] rounded transition-colors flex items-center justify-center gap-1.5"
                                type="button" @click="resetSimulation">
                                <span>Reiniciar</span> <span>↺</span>
                            </button>
                        </div>
                    </div>
                </aside>

                <!-- Results Column -->
                <div class="grid gap-6">

                    <!-- Metrics Strip -->
                    <div class="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4">
                        <div
                            class="min-w-0 bg-[#fffdf8] border border-[#173d42]/11 p-4 rounded-xl shadow-sm grid gap-1">
                            <span
                                class="font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.08em] text-[#597174]">Rodadas</span>
                            <strong class="font-['Fraunces',Georgia,serif] text-2xl font-semibold text-[#102f34]">{{
                                roundCount.toString().padStart(2, '0') }}</strong>
                            <span
                                class="font-['IBM_Plex_Mono'] text-[8px] uppercase tracking-[0.08em] text-[#597174]">total</span>
                        </div>
                        <div
                            class="min-w-0 bg-[#fffdf8] border border-[#173d42]/11 p-4 rounded-xl shadow-sm grid gap-1">
                            <span
                                class="font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.08em] text-[#597174]">Odd
                                ativa</span>
                            <strong class="font-['Fraunces',Georgia,serif] text-2xl font-semibold text-[#102f34]">{{
                                formatOdd(currentOdd) }}</strong>
                            <span
                                class="font-['IBM_Plex_Mono'] text-[8px] uppercase tracking-[0.08em] text-[#597174]">fator</span>
                        </div>
                        <div
                            class="min-w-0 bg-[#fffdf8] border border-[#173d42]/11 p-4 rounded-xl shadow-sm grid gap-1">
                            <span
                                class="font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.08em] text-[#597174]">Lucro
                                da casa</span>
                            <strong class="font-['Fraunces',Georgia,serif] text-2xl font-semibold"
                                :class="houseProfit >= 0 ? 'text-[#3f775e]' : 'text-[#b25745]'">{{
                                    signedCurrency(houseProfit) }}</strong>
                            <span
                                class="font-['IBM_Plex_Mono'] text-[8px] uppercase tracking-[0.08em] text-[#597174]">acumulado</span>
                        </div>
                        <div
                            class="min-w-0 bg-[#fffdf8] border border-[#173d42]/11 p-4 rounded-xl shadow-sm grid gap-1">
                            <span
                                class="font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.08em] text-[#597174]">Último
                                resultado</span>
                            <strong
                                class="min-w-0 max-w-full font-['Fraunces',Georgia,serif] text-base font-semibold text-[#102f34] truncate">{{
                                    latestReading }}</strong>
                            <span
                                class="font-['IBM_Plex_Mono'] text-[8px] uppercase tracking-[0.08em] text-[#597174]">dado
                                sorteado</span>
                        </div>
                    </div>

                    <!-- Rounds History Board -->
                    <section
                        class="min-w-0 overflow-hidden bg-[#fffdf8] border border-[#173d42]/11 p-4 sm:p-8 rounded-2xl shadow-sm">
                        <div class="flex flex-wrap items-center justify-between gap-3 mb-5 sm:mb-6">
                            <div>
                                <p
                                    class="font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.08em] font-semibold text-[#e96b4b] mb-1">
                                    02 / Histórico</p>
                                <h2 class="font-['Fraunces',Georgia,serif] text-2xl font-semibold text-[#102f34]">
                                    Rodadas executadas</h2>
                            </div>
                            <div
                                class="inline-flex items-center gap-2 font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-[0.08em] text-[#597174]">
                                <span
                                    class="w-2 h-2 rounded-full bg-[#3f775e] shadow-[0_0_0_4px_rgba(63,119,94,0.12)]"></span>
                                ativo
                            </div>
                        </div>

                        <div v-if="!history.length"
                            class="min-w-0 overflow-hidden p-6 sm:p-12 text-center border-2 border-dashed border-[#173d42]/15 rounded-xl bg-[#faf8f2]/50">
                            <div class="grid max-w-md gap-3 mx-auto">
                                <span class="font-['IBM_Plex_Mono'] text-3xl font-bold text-[#e96b4b]/40">00</span>
                                <h3
                                    class="break-words font-['Fraunces',Georgia,serif] text-lg font-semibold text-[#102f34] m-0">
                                    Nenhuma rodada simulada ainda.</h3>
                                <p class="break-words text-[#597174] text-xs leading-relaxed m-0">Preencha os nomes,
                                    defina ascurrentOdd
                                    apostas e clique em executar para ver o comportamento estatístico rodada a rodada.
                                </p>
                            </div>
                        </div>

                        <div v-else class="grid gap-3 max-h-[500px] overflow-x-hidden overflow-y-auto pr-1 sm:pr-2">
                            <article v-for="round in history" :key="round.id"
                                class="p-3 sm:p-4 bg-[#faf8f2] border border-[#173d42]/12 rounded-xl grid gap-3 transition-all hover:border-[#e96b4b]/40">
                                <header
                                    class="flex flex-wrap items-center justify-between gap-3 text-xs pb-3 border-b border-[#173d42]/10">
                                    <div class="flex items-center gap-2 font-['IBM_Plex_Mono']">
                                        <span class="text-[9px] text-[#597174]">Rodada</span>
                                        <strong class="text-[#102f34] font-semibold">#{{
                                            round.round.toString().padStart(2, '0') }}</strong>
                                    </div>
                                    <div
                                        class="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-[#173d42]/10">
                                        <span
                                            class="w-5 h-5 rounded bg-[#173d42] text-white grid place-items-center font-['IBM_Plex_Mono'] text-[10px] font-bold">{{
                                                round.die }}</span>
                                        <span
                                            class="font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.08em] text-[#597174]">Sorteado:</span>
                                        <strong class="font-['IBM_Plex_Mono'] text-[10px] font-bold text-[#102f34]">{{
                                            round.outcome }}</strong>
                                    </div>
                                    <span
                                        class="font-['IBM_Plex_Mono'] text-[10px] text-[#e96b4b] font-semibold bg-[#e96b4b]/10 px-2.5 py-0.5 rounded">odd
                                        {{ formatOdd(round.odd) }}</span>
                                </header>

                                <div class="grid gap-3 sm:grid-cols-2">
                                    <div class="flex flex-col gap-3 p-3 bg-white border rounded-lg sm:flex-row sm:items-center sm:justify-between"
                                        :class="round.playerOne.won ? 'border-[#3f775e]/30 bg-[#edf3ed]/40' : 'border-[#173d42]/10'">
                                        <div class="grid gap-0.5">
                                            <span
                                                class="font-['IBM_Plex_Mono'] text-[8px] uppercase tracking-[0.08em] font-bold"
                                                :class="round.playerOne.won ? 'text-[#3f775e]' : 'text-[#b25745]'">{{
                                                    round.playerOne.won ? 'VENCEU' : 'PERDEU' }}</span>
                                            <strong class="text-xs text-[#102f34]">{{ round.playerOne.name }}</strong>
                                            <span class="font-['IBM_Plex_Mono'] text-[9px] text-[#597174]">{{
                                                round.playerOne.choice }} · Aposta {{
                                                    formatCurrency(round.playerOne.bet) }}</span>
                                        </div>
                                        <div class="text-right">
                                            <strong class="font-['IBM_Plex_Mono'] text-xs font-semibold"
                                                :class="round.playerOne.won ? 'text-[#3f775e]' : 'text-[#b25745]'">{{
                                                    round.playerOne.won ? `+ ${formatCurrency(round.playerOne.profit)}` : `−
                                                ${formatCurrency(round.playerOne.loss)}` }}</strong>
                                        </div>
                                    </div>

                                    <div class="flex flex-col gap-3 p-3 bg-white border rounded-lg sm:flex-row sm:items-center sm:justify-between"
                                        :class="round.playerTwo.won ? 'border-[#3f775e]/30 bg-[#edf3ed]/40' : 'border-[#173d42]/10'">
                                        <div class="grid gap-0.5">
                                            <span
                                                class="font-['IBM_Plex_Mono'] text-[8px] uppercase tracking-[0.08em] font-bold"
                                                :class="round.playerTwo.won ? 'text-[#3f775e]' : 'text-[#b25745]'">{{
                                                    round.playerTwo.won ? 'VENCEU' : 'PERDEU' }}</span>
                                            <strong class="text-xs text-[#102f34]">{{ round.playerTwo.name }}</strong>
                                            <span class="font-['IBM_Plex_Mono'] text-[9px] text-[#597174]">{{
                                                round.playerTwo.choice }} · Aposta {{
                                                    formatCurrency(round.playerTwo.bet) }}</span>
                                        </div>
                                        <div class="text-right">
                                            <strong class="font-['IBM_Plex_Mono'] text-xs font-semibold"
                                                :class="round.playerTwo.won ? 'text-[#3f775e]' : 'text-[#b25745]'">{{
                                                    round.playerTwo.won ? `+ ${formatCurrency(round.playerTwo.profit)}` : `−
                                                ${formatCurrency(round.playerTwo.loss)}` }}</strong>
                                        </div>
                                    </div>
                                </div>

                                <footer
                                    class="flex items-center justify-between pt-2 border-t border-[#173d42]/10 font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-[0.08em]">
                                    <span class="text-[#597174]">Lucro da casa na rodada:</span>
                                    <strong class="text-xs font-bold"
                                        :class="round.houseProfit >= 0 ? 'text-[#3f775e]' : 'text-[#b25745]'">{{
                                            signedCurrency(round.houseProfit) }}</strong>
                                </footer>
                            </article>
                        </div>
                    </section>

                    <!-- Ledger (Consolidated Balance) -->
                    <section
                        class="min-w-0 overflow-hidden bg-[#fffdf8] border border-[#173d42]/11 p-4 sm:p-8 rounded-2xl shadow-sm">
                        <div class="flex flex-wrap items-center justify-between gap-3 mb-5 sm:mb-6">
                            <div>
                                <p
                                    class="font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.08em] font-semibold text-[#e96b4b] mb-1">
                                    03 / Consolidado</p>
                                <h2 class="font-['Fraunces',Georgia,serif] text-2xl font-semibold text-[#102f34]">
                                    Balanço financeiro</h2>
                            </div>
                            <span
                                class="font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.08em] text-[#597174]">Resultados
                                acumulados</span>
                        </div>

                        <div class="overflow-x-auto">
                            <div class="min-w-[620px] sm:min-w-0 grid gap-2">
                                <div
                                    class="grid grid-cols-5 p-3 bg-[#faf8f2] font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-[0.08em] text-[#597174] font-semibold rounded">
                                    <span>Participante</span><span>Total apostado</span><span>Vitórias /
                                        Derrotas</span><span>Líquido</span><span>Saldo final</span>
                                </div>
                                <div v-for="summary in playerSummaries" :key="summary.name"
                                    class="grid grid-cols-5 p-3.5 items-center border-b border-[#173d42]/10 text-xs font-['IBM_Plex_Mono']">
                                    <span class="flex flex-col"><strong class="font-semibold text-[#102f34]">{{
                                        summary.name }}</strong><small
                                            class="text-[9px] text-[#597174] uppercase">{{ summary.choice
                                            }}</small></span>
                                    <span>{{ formatCurrency(summary.totalBet) }}</span>
                                    <span>{{ summary.wins }}V / {{ summary.defeats }}D</span>
                                    <span class="font-semibold"
                                        :class="summary.net >= 0 ? 'text-[#3f775e]' : 'text-[#b25745]'">{{
                                            signedCurrency(summary.net) }}</span>
                                    <span class="font-bold text-[#102f34]">{{ formatCurrency(summary.balance) }}</span>
                                </div>
                                <div
                                    class="grid grid-cols-5 p-3.5 items-center bg-[#edf3ed] border border-[#3f775e]/30 rounded font-['IBM_Plex_Mono'] text-xs">
                                    <span class="flex flex-col"><strong class="font-semibold text-[#102f34]">Casa de
                                            Apostas</strong><small
                                            class="text-[9px] text-[#3f775e] uppercase">banca</small></span>
                                    <span>—</span>
                                    <span>—</span>
                                    <span class="font-semibold"
                                        :class="houseProfit >= 0 ? 'text-[#3f775e]' : 'text-[#b25745]'">{{
                                            signedCurrency(houseProfit) }}</span>
                                    <span class="font-bold text-[#102f34]">{{ formatCurrency(houseProfit) }}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Learning Note -->
                    <section
                        class="bg-[#102f34] text-[#fffdf8] p-5 sm:p-8 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                        <span
                            class="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-[0.08em] text-[#e96b4b] shrink-0">Conclusão
                            / 04</span>
                        <div class="grid gap-2">
                            <h2
                                class="break-words font-['Fraunces',Georgia,serif] text-xl font-semibold text-[#fffdf8] m-0">
                                Enquanto o apostador depende da sorte, a casa depende da matemática.</h2>
                            <p class="text-[#f4f0e7] text-xs leading-relaxed m-0 opacity-90">
                                Este simulador em Vue.js com Tailwind CSS mostra que uma odd dentro do limite calculado
                                mantém margem positiva e evita prejuízos indesejados para a banca.
                            </p>
                        </div>
                    </section>

                    <p v-if="feedback"
                        class="p-3 bg-[#edf3ed] text-[#3f775e] font-['IBM_Plex_Mono'] text-xs rounded text-center">{{
                            feedback }}</p>
                </div>
            </section>

            <!-- Footer -->
            <footer
                class="py-5 sm:py-6 border-t border-[#173d42]/15 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:justify-between font-['IBM_Plex_Mono'] text-[9px] sm:text-[10px] uppercase tracking-[0.08em] text-[#597174]">
                <div class="flex flex-col">
                    <span class="break-words">Simulador de Apostas com Dado · Vue.js + Tailwind CSS</span>
                    <span>
                        <a href="https://github.com/Elivandro/elivandro.github.io"
                            class="text-[#e96b4b] hover:underline">
                            GitHub
                        </a>
                    </span>
                </div>
                <span>Uso didático e estatístico</span>
            </footer>

        </div>
    </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
</style>
