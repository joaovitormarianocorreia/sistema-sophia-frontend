import { useState, useEffect, useMemo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useTable } from 'react-table'
import { FaWindowClose, FaPlusSquare } from 'react-icons/fa'
import { toast } from 'react-toastify'

import Button from 'components/button'

export const types = {
  DEFICIENCIAS: { route: 'deficiencies', description: 'Deficiências' },
  REMEDIOS: { route: 'remedies', description: 'Remédios' },
}

const DeficiencyAndRemedyComponent = ({ type, matricula }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [entities, setEntities] = useState([])

  const tableColumns = useMemo(
    () => [
      {
        Header: type.description,
        accessor: 'descricao',
      },
    ],
    []
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns: tableColumns,
      data: entities,
    })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const fetchEntitiesList = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/${type.route}/${matricula}`
      )
      const json = await response.json()
      setEntities(json)
    } catch (err) {
      toast.error(err.message)
    }
  }, [type, matricula])

  useEffect(() => {
    fetchEntitiesList()
    setIsEditing(false)
  }, [fetchEntitiesList])

  const handleExclusion = async (descricao) => {
    const toBeDeleted = {
      matricula: matricula,
      descricao: descricao,
    }

    try {
      const response = await fetch(`http://localhost:3001/api/${type.route}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toBeDeleted),
      })

      const responseText = await response.text()
      if (response.status !== 200) {
        throw responseText
      }

      setEntities((prevState) =>
        prevState.filter((entity) => entity.descricao !== descricao)
      )

      setIsEditing(false)
      reset({})

      toast.success(responseText)
    } catch (err) {
      toast.error(
        `Não foi possível remover a ${type.description.toLowerCase()}: ` + err
      )
    }
  }

  const onSubmit = async ({ descricao }) => {
    const toBeAssociated = {
      matricula: matricula,
      descricao: descricao,
    }

    try {
      const response = await fetch(`http://localhost:3001/api/${type.route}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toBeAssociated),
      })

      const responseText = await response.text()
      if (response.status !== 200) {
        throw responseText
      }

      toast.success(responseText)
      fetchEntitiesList()
      setIsEditing(false)
    } catch (err) {
      toast.error(`Falha ao cadastrar ${type.route}: ` + err)
    }
  }

  return (
    <>
      <div className="form-header">
        <h2>{type.description}</h2>
        <button
          className="icon-button"
          title="Voltar para a listagem"
          onClick={() => {
            setIsEditing(!isEditing)
            reset({})
            fetchEntitiesList()
          }}
        >
          {isEditing ? <FaWindowClose /> : <FaPlusSquare />}
        </button>
      </div>
      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <label htmlFor="descricao">Descrição</label>
            {type === types.DEFICIENCIAS ? (
              <select {...register('descricao')}>
                <option value="deficiência A">Deficiência A</option>
                <option value="deficiência B">Deficiência B</option>
                <option value="deficiência C">Deficiência C</option>
              </select>
            ) : (
              <select {...register('descricao')}>
                <option value="remédio A">Remédio A</option>
                <option value="remédio B">Remédio B</option>
                <option value="remédio C">Remédio C</option>
              </select>
            )}
            {errors.nome && <span>Descrição é obrigatório</span>}
          </div>
          <div className="form-footer">
            <Button type="submit">{`Cadastrar ${type.description.toLowerCase()}`}</Button>
          </div>
        </form>
      ) : entities.length > 0 ? (
        <table {...getTableProps()}>
          <thead className="table-header">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                ))}
                <th>Ação</th>
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        style={{ textTransform: 'capitalize' }}
                        {...cell.getCellProps()}
                      >
                        {cell.render('Cell')}
                      </td>
                    )
                  })}
                  <td>
                    <button
                      onClick={() => handleExclusion(row.original.descricao)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : (
        <p
          style={{
            fontStyle: 'italic',
            textAlign: 'center',
            margin: '25px 0',
          }}
        >
          Ainda não há nada cadastrado.{' '}
        </p>
      )}
    </>
  )
}

export default DeficiencyAndRemedyComponent
