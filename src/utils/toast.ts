import toasteventbus from 'primevue/toasteventbus'

export function show(summary: string, detail: string, life: number = 8000) {
	toasteventbus.emit('add', { severity: 'secondary', summary, detail, life })
}

export function contrast(summary: string, detail: string, life: number = 8000) {
	toasteventbus.emit('add', { severity: 'contrast', summary, detail, life })
}

export function info(summary: string, detail: string, life: number = 8000) {
	toasteventbus.emit('add', { severity: 'info', summary, detail, life })
}

export function warn(summary: string, detail: string, life: number = 8000) {
	toasteventbus.emit('add', { severity: 'warn', summary, detail, life })
}

export function success(summary: string, detail: string, life: number = 8000) {
	toasteventbus.emit('add', { severity: 'success', summary, detail, life })
}

export function error(summary: string, detail: string, life: number = 8000) {
	toasteventbus.emit('add', { severity: 'error', summary, detail, life })
}


// import * as toast from 'primevue/toast'
// toast.show('title', 'detail');

