export interface Transaction {
    id: string
    order: Array<{
        id: string
        quantity: number
    }>
    bank_id: string
    payment_id?: string
    created_at: string
    status: 'pending' | 'completed' | 'failed'
}