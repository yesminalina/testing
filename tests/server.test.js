import request from 'supertest'
import app from '../index.js'
import { describe, test, expect } from 'vitest'

const FALSE_ID = 1000
const TRUE_ID = 2
const ID_ERROR_MESSAGE = 'No se encontró ningún cafe con ese id'
const VALID_NEW_CAFE = { id: 5, nombre: 'Frapuccino' }
const VALID_CAFE = { id: 1, nombre: 'Cortado' }
const MISMATCHED_ID_RESPONSE = { message: 'El id del parámetro no coincide con el id del café recibido' }

describe('Operaciones CRUD de cafes', () => {
  test('[GET] /cafes | Debería retornar 200 si muestra los cafés.', async () => {
    const response = await request(app).get('/cafes').send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body.length).toBeGreaterThan(0)
  })

  test('[DELETE] /cafes/:id | Debería retornar 404 si intenta eliminar un café que no existe', async () => {
    const response = await request(app).delete(`/cafes/${FALSE_ID}`).set('Authorization', 'token').send()

    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe(ID_ERROR_MESSAGE)
  })

  test('[POST] /cafes | Debería devolver 201 al agregar un nuevo café', async () => {
    const response = await request(app).post('/cafes').send(VALID_NEW_CAFE)

    expect(response.statusCode).toBe(201)
    expect(response.body).toBeInstanceOf(Object)
  })

  test('[PUT] /cafes/:id | Debería devolver 400 al modificar un café cuyo id en el parámetro no coincida con el ID del payload ', async () => {
    const response = await request(app).put(`/cafes/${TRUE_ID}`).send(VALID_CAFE)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(MISMATCHED_ID_RESPONSE)
  })
})
