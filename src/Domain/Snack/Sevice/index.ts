import { Knex } from '../../../../database/knex'

export function getSnacksByUserEmail(email: string) {
    return Knex('users')
        .where('email', email)
        .join('snacks', 'users.id', '=', 'snacks.user_id')
        .select('snacks.*')
}

export function getTotalSnacksByDiet(email: string, diet: number) {
    return Knex('users')
        .where('email', email)
        .where('diet', diet)
        .join('snacks', 'users.id', '=', 'snacks.user_id')
        .select('snacks.*')        
}

export async function getBestDietScore(email: string) {
    let sequences: any = []
    let count = 0;

    const results =  await Knex('users')
        .where('email', email)        
        .join('snacks', 'users.id', '=', 'snacks.user_id')
        .select('snacks.*')

    results.forEach((data, key) => {
        if(data.diet) {
            count++            
        } 
        
        if(!data.diet && count) {
            sequences.push(count)
            count = 0
        }
        
        if (key == results.length - 1) {
            sequences.push(count)
        }
    })

    return sequences.reduce(function (a: number, b: number) {
        return Math.max(a, b);
    }, -Infinity);
}
