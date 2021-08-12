import { useState, useMemo, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTable } from 'react-table'
import { toast } from 'react-toastify'
import { FaWindowClose, FaPlusSquare } from 'react-icons/fa'

import Button from 'components/button'

const Responsible = ({
  codigoResponsavel,
  setCodigoResponsavel,
  aluno = null,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [responsible, setResponsible] = useState([])

  const inputResponsavel = useRef()
  const inputResponsavelFinanceiro = useRef()

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Nome do responsável',
        accessor: 'nome',
      },
      {
        Header: 'CPF',
        accessor: 'cpf',
      },
      {
        Header: 'Descrição corporal',
        accessor: 'descricaoCorporal',
      },
    ],
    []
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns: tableColumns,
      data: responsible,
    })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  useEffect(() => {
    fetchResponsibleList()
    setIsEditing(false)
  }, [])

  const fetchResponsibleList = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/responsible/list')
      const json = await response.json()
      setResponsible(json)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const fetchResponsible = async (codigo) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/responsible/${codigo}`
      )

      const json = await response.json()
      reset(json)
      setIsEditing(true)
      setCodigoResponsavel(codigo)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleExclusion = async (codigo) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/responsible/${codigo}`,
        {
          method: 'DELETE',
        }
      )

      const responseText = await response.text()
      if (response.status === 500) {
        throw responseText
      }

      setResponsible((prevState) =>
        prevState.filter((responsible) => responsible.codigo !== codigo)
      )
      setIsEditing(false)
      setCodigoResponsavel(0)
      reset({})

      toast.success(responseText)
    } catch (err) {
      toast.error('Não foi possível remover o responsável: ' + err)
    }
  }

  const handleResponsibleAttribution = async (checked, codigo) => {
    let verb

    if (checked) {
      verb = 'POST'
    } else {
      verb = 'DELETE'
    }

    const attributeObject = {
      codigoResponsavel: codigo,
      matriculaAluno: aluno.matricula,
      responsavelFinanceiro: inputResponsavelFinanceiro.current.checked ? 1 : 0,
    }

    try {
      const response = await fetch(
        'http://localhost:3001/api/responsibleStudents',
        {
          method: verb,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(attributeObject),
        }
      )

      const responseText = await response.text()

      if (response.status === 500) {
        throw responseText
      }

      toast.success(responseText)
      fetchResponsibleList()
    } catch (err) {
      toast.error('Falha ao atribuir aluno a responsável: ' + err)
    }
  }

  const handleFinancialResponsibleAttribution = async (checked, codigo) => {
    let verb = 'PUT'

    if (checked && !inputResponsavel.current.checked) {
      verb = 'POST'
    }

    const attributeObject = {
      codigoResponsavel: codigo,
      matriculaAluno: aluno.matricula,
      responsavelFinanceiro: checked ? 1 : 0,
    }

    try {
      const response = await fetch(
        'http://localhost:3001/api/responsibleStudents',
        {
          method: verb,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(attributeObject),
        }
      )

      const responseText = await response.text()

      if (response.status === 500) {
        throw responseText
      }

      toast.success(responseText)
      fetchResponsibleList()
    } catch (err) {
      toast.error('Falha ao atribuir aluno a responsável: ' + err)
    }
  }

  const onSubmit = async (data) => {
    const url = codigoResponsavel
      ? `http://localhost:3001/api/responsible/${codigoResponsavel}`
      : 'http://localhost:3001/api/responsible'
    const verb = codigoResponsavel ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method: verb,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.status === 500) {
        const exception = await response.text()
        throw exception
      }

      const json = await response.json()
      setCodigoResponsavel(json.data)
      toast.success(json.msg)
    } catch (err) {
      toast.error('Falha ao cadastrar responsável: ' + err)
    }
  }

  return (
    <>
      <div className="form-header">
        <h2>Responsáveis</h2>
        <button
          className="icon-button"
          title="Voltar para a listagem"
          onClick={() => {
            setIsEditing(!isEditing)
            setCodigoResponsavel(0)
            reset({})
            fetchResponsibleList()
          }}
        >
          {isEditing ? <FaWindowClose /> : <FaPlusSquare />}
        </button>
      </div>
      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              maxLength="50"
              {...register('nome', { required: true, maxLength: 50 })}
            />
            {errors.nome && <span>Nome é obrigatório</span>}
          </div>
          <div className="form-control">
            <label htmlFor="cpf">CPF</label>
            <input
              id="cpf"
              maxLength="11"
              {...register('cpf', { required: true, maxLength: 11 })}
            />
            {errors.cpf && <span>CPF é obrigatório</span>}
          </div>
          <div className="form-control">
            <label htmlFor="dataNasc">Data de nascimento</label>
            <input
              id="dataNasc"
              type="date"
              {...register('dataNasc', { required: true })}
            />
            {errors.dataNasc && <span>Data de nascimento é obrigatório</span>}
          </div>
          <div className="form-control">
            <label htmlFor="telefone">Telefone</label>
            <input
              id="telefone"
              maxLength="8"
              {...register('telefone', { required: true, maxLength: 8 })}
            />
            {errors.telefone && <span>Telefone é obrigatório</span>}
          </div>
          <div className="form-control">
            <label htmlFor="celular">Celular</label>
            <input
              id="celular"
              maxLength="9"
              {...register('celular', { required: true, maxLength: 9 })}
            />
            {errors.celular && <span>Celular é obrigatório</span>}
          </div>
          <div className="form-control">
            <label htmlFor="descricaoCorporal">Descrição corporal</label>
            <input
              id="descricaoCorporal"
              maxLength="50"
              {...register('descricaoCorporal', {
                required: true,
                maxlength: 50,
              })}
            />
            {errors.descricaoCorporal && (
              <span>Descrição corporal é obrigatório</span>
            )}
          </div>
          <div className="form-footer">
            <Button type="submit">
              {codigoResponsavel
                ? 'Atualizar responsável'
                : 'Cadastrar responsável'}
            </Button>
            {codigoResponsavel !== 0 && (
              <Button
                className="danger"
                onClick={() => handleExclusion(codigoResponsavel)}
              >
                Remover responsável
              </Button>
            )}
          </div>
        </form>
      ) : responsible.length > 0 ? (
        <table {...getTableProps()}>
          <thead className="table-header">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                ))}
                {aluno && (
                  <>
                    <th>Responsável por {aluno.nome}?</th>
                    <th>Responsável financeiro?</th>
                  </>
                )}
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
                  {aluno && (
                    <>
                      <td>
                        <input
                          name="responsavel"
                          type="checkbox"
                          checked={row.original.responsavel}
                          onChange={(event) =>
                            handleResponsibleAttribution(
                              event.target.checked,
                              row.original.codigo
                            )
                          }
                          ref={inputResponsavel}
                        />
                      </td>
                      <td>
                        <input
                          name="responsavelFinanceiro"
                          type="checkbox"
                          checked={row.original.responsavelFinanceiro}
                          onChange={(event) =>
                            handleFinancialResponsibleAttribution(
                              event.target.checked,
                              row.original.codigo
                            )
                          }
                          ref={inputResponsavelFinanceiro}
                        />
                      </td>
                    </>
                  )}
                  <td>
                    <button
                      onClick={() => fetchResponsible(row.original.codigo)}
                    >
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
          Ainda não há nenhum responsável cadastrado.
        </p>
      )}
    </>
  )
}

export default Responsible
