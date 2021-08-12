import { useState, useMemo, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTable } from 'react-table'
import { toast } from 'react-toastify'
import { FaWindowClose, FaPlusSquare } from 'react-icons/fa'

import Button from 'components/button'

export const addressTypes = {
  STUDENT: 'student',
  RESPONSIBLE: 'responsible',
}

const AddressComponent = ({ alunoOuResponsavel = null }) => {
  console.log(alunoOuResponsavel?.type)
  const [codigoEndereco, setCodigoEndereco] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [address, setAddress] = useState([])

  const inputMoraNoEndereco = useRef()

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Logradouro',
        accessor: 'logradouro',
      },
      {
        Header: 'Número',
        accessor: 'numero',
      },
      {
        Header: 'Cidade',
        accessor: 'cidade',
      },
    ],
    []
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns: tableColumns,
      data: address,
    })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  useEffect(() => {
    fetchAddressesList()
    setIsEditing(false)
  }, [])

  const fetchAddressesList = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/addresses/list')
      const json = await response.json()
      setAddress(json)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const fetchAddress = async (codigo) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/addresses/${codigo}`
      )

      const json = await response.json()
      reset(json)
      setIsEditing(true)
      setCodigoEndereco(codigo)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleExclusion = async (codigo) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/addresses/${codigo}`,
        {
          method: 'DELETE',
        }
      )

      const responseText = await response.text()
      if (response.status === 500) {
        throw responseText
      }

      setAddress((prevState) =>
        prevState.filter((address) => address.codigo !== codigo)
      )

      setIsEditing(false)
      setCodigoEndereco(0)
      reset({})

      toast.success(responseText)
    } catch (err) {
      toast.error('Não foi possível remover o endereço: ' + err)
    }
  }

  const handleAddressAttribution = async (checked, codigoEndereco) => {
    const url =
      alunoOuResponsavel?.type === addressTypes.STUDENT
        ? 'http://localhost:3001/api/studentsAddresses'
        : 'http://localhost:3001/api/responsibleAddresses'

    let attributeObject

    if (alunoOuResponsavel?.type === addressTypes.STUDENT) {
      attributeObject = {
        codigoEndereco: codigoEndereco,
        matriculaAluno: alunoOuResponsavel?.id,
      }
    } else {
      attributeObject = {
        codigoEndereco: codigoEndereco,
        codigoResponsavel: alunoOuResponsavel?.id,
      }
    }

    try {
      const response = await fetch(url, {
        method: checked ? 'POST' : 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attributeObject),
      })

      const responseText = await response.text()

      if (response.status === 500) {
        throw responseText
      }

      toast.success(responseText)
      fetchAddressesList()
    } catch (err) {
      toast.error(
        `Falha ao atribuir endereço a ${alunoOuResponsavel?.type}: ` + err
      )
    }
  }

  const onSubmit = async (data) => {
    const url = codigoEndereco
      ? `http://localhost:3001/api/addresses/${codigoEndereco}`
      : 'http://localhost:3001/api/addresses'
    const verb = codigoEndereco ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method: verb,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseText = await response.text()
      if (response.status !== 200) {
        throw responseText
      }

      toast.success(responseText)
      setIsEditing(false)
      fetchAddressesList()
      reset({})
    } catch (err) {
      toast.error('Falha ao cadastrar endereço: ' + err)
    }
  }

  return (
    <>
      <div className="form-header">
        <h2>Endereços</h2>
        <button
          className="icon-button"
          title="Voltar para a listagem"
          onClick={() => {
            setIsEditing(!isEditing)
            setCodigoEndereco(0)
            reset({})
            fetchAddressesList()
          }}
        >
          {isEditing ? <FaWindowClose /> : <FaPlusSquare />}
        </button>
      </div>
      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <label htmlFor="logradouro">Logradouro</label>
            <input
              id="logradouro"
              maxLength="50"
              {...register('logradouro', { required: true, maxLength: 50 })}
            />
            {errors.logradouro && <span>Logradouro é obrigatório</span>}
          </div>
          <div className="form-control">
            <label htmlFor="numero">Número</label>
            <input
              id="numero"
              type="number"
              {...register('numero', { required: true })}
            />
            {errors.numero && <span>Número é obrigatório</span>}
          </div>
          <div className="form-control">
            <label htmlFor="cidade">Cidade</label>
            <input
              id="cidade"
              maxLength="50"
              {...register('cidade', { required: true })}
            />
            {errors.cidade && <span>Cidade é obrigatório</span>}
          </div>
          <div className="form-control">
            <label htmlFor="estado">Estado</label>
            <input
              id="estado"
              maxLength="2"
              {...register('estado', { required: true, maxLength: 2 })}
            />
            {errors.estado && <span>Estado é obrigatório</span>}
          </div>
          <div className="form-control">
            <label htmlFor="cep">CEP</label>
            <input
              id="cep"
              maxLength="8"
              {...register('cep', { required: true, maxLength: 8 })}
            />
            {errors.cep && <span>CEP é obrigatório</span>}
          </div>
          <div className="form-control">
            <label htmlFor="complemento">Complemento</label>
            <input
              id="complemento"
              maxLength="50"
              {...register('complemento', { maxLength: 50 })}
            />
            {errors.complemento && <span>Complemento é obrigatório</span>}
          </div>
          <div className="form-footer">
            <Button type="submit">
              {codigoEndereco ? 'Atualizar endereço' : 'Cadastrar endereço'}
            </Button>
            {codigoEndereco !== 0 && (
              <Button
                className="danger"
                onClick={() => handleExclusion(codigoEndereco)}
              >
                Remover endereço
              </Button>
            )}
          </div>
        </form>
      ) : address.length > 0 ? (
        <table {...getTableProps()}>
          <thead className="table-header">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                ))}
                {alunoOuResponsavel && <th>Morador?</th>}
                <th colSpan={2}>Ações</th>
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
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    )
                  })}
                  {alunoOuResponsavel && (
                    <td>
                      <input
                        name="responsavel"
                        type="checkbox"
                        checked={
                          alunoOuResponsavel.type === addressTypes.STUDENT
                            ? row.original.alunoMora
                            : row.original.responsavelMora
                        }
                        onChange={(event) => {
                          handleAddressAttribution(
                            event.target.checked,
                            row.original.codigo
                          )
                        }}
                        ref={inputMoraNoEndereco}
                      />
                    </td>
                  )}
                  <td>
                    <button onClick={() => fetchAddress(row.original.codigo)}>
                      Editar
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleExclusion(row.original.codigo)}
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
          Ainda não há nenhum endereço cadastrado.
        </p>
      )}
    </>
  )
}

export default AddressComponent
