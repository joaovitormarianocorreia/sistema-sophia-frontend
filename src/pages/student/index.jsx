import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import queryString from 'query-string'

import Button from 'components/button'
import AddressComponent, { addressTypes } from 'components/address'
import ResponsibleComponent from 'components/responsible'
import DeficiencyAndRemedyComponent, {
  types,
} from 'components/deficiencyAndRemedyComponent'

import { Wrapper, Content, SideContent } from './styles'

const stages = {
  CADASTRO_DE_ALUNO: 'Cadastro de aluno',
  ENDERECOS: 'Endereços',
  RESPONSAVEIS: 'Responsáveis',
  DEFICIENCIAS: 'Deficiências',
  REMEDIOS: 'Remédios',
}

const Student = (props) => {
  const { matricula } = queryString.parse(props.location.search)
  const [stage, setStage] = useState(stages.CADASTRO_DE_ALUNO)

  const [codigoResponsavel, setCodigoResponsavel] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm()

  const fetchStudent = useCallback(
    async (matricula) => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/students/${matricula}`
        )

        const json = await response.json()
        reset(json)
      } catch (error) {
        toast.error('Não foi possível buscar o aluno')
      }
    },
    [reset]
  )

  const onSubmit = async (data) => {
    const url = matricula
      ? `http://localhost:3001/api/students/${matricula}`
      : 'http://localhost:3001/api/students'
    const verb = matricula ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method: verb,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      toast.success(
        `Registro ${matricula ? 'atualizado' : 'realizado'} com sucesso!`,
        {
          position: 'top-center',
        }
      )

      if (!matricula) {
        const json = await response.json()
        props.history.push(`/student?matricula=${json.data}`)
      }
    } catch (error) {
      toast.error('Falha ao cadastrar aluno', { position: 'top-center' })
    }
  }

  useEffect(() => {
    if (matricula) {
      fetchStudent(matricula)
    }
  }, [matricula, fetchStudent])

  return (
    <Wrapper>
      <Content matricula={matricula}>
        {stage === stages.CADASTRO_DE_ALUNO && (
          <>
            <div className="form-header">
              <h2>{stages.CADASTRO_DE_ALUNO}</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-control">
                <label htmlFor="nome">Nome do aluno</label>
                <input id="nome" {...register('nome', { required: true })} />
                {errors.nome && <span>Nome é obrigatório</span>}
              </div>
              <div className="form-control">
                <label htmlFor="certNasc">Certidão de nascimento</label>
                <input
                  id="certNasc"
                  {...register('certNasc', { required: true })}
                />
                {errors.certNasc && (
                  <span>Certidão de nascimento é obrigatório</span>
                )}
              </div>
              <div className="form-control">
                <label htmlFor="dataNasc">Data de nascimento</label>
                <input
                  id="dataNasc"
                  type="date"
                  {...register('dataNasc', { required: true })}
                />
                {errors.dataNasc && (
                  <span>Data de nascimento é obrigatório</span>
                )}
              </div>
              <div className="form-control">
                <label htmlFor="turno">Turno</label>
                <select id="turno" {...register('turno', { required: true })}>
                  <option value="manhã">Manhã</option>
                  <option value="tarde">Tarde</option>
                </select>
                {errors.dataNasc && <span>Turno é obrigatório</span>}
              </div>
              <div className="form-control">
                <label htmlFor="turma">Turma</label>
                <input
                  id="turma"
                  type="text"
                  {...register('turma', { required: true })}
                />
                {errors.turma && <span>Turma é obrigatório</span>}
              </div>
              <div className="form-control">
                <label htmlFor="ano">Ano</label>
                <input
                  id="ano"
                  type="text"
                  placeholder="Ex: 2021"
                  {...register('ano', { required: true })}
                />
                {errors.ano && <span>Ano é obrigatório</span>}
              </div>
              <div className="form-footer">
                <Button type="submit">
                  {matricula ? 'Atualizar aluno' : 'Cadastrar aluno'}
                </Button>
                {/* {matricula && <Button className="danger">Remover aluno</Button>} */}
              </div>
            </form>
          </>
        )}
        {stage === stages.ENDERECOS && (
          <AddressComponent
            alunoOuResponsavel={{
              id: matricula,
              type: addressTypes.STUDENT,
            }}
          />
        )}
        {stage === stages.RESPONSAVEIS && (
          <ResponsibleComponent
            codigoResponsavel={codigoResponsavel}
            setCodigoResponsavel={setCodigoResponsavel}
            aluno={{
              matricula: matricula,
              nome: getValues('nome'),
            }}
          />
        )}
        {stage === stages.DEFICIENCIAS && (
          <DeficiencyAndRemedyComponent
            type={types.DEFICIENCIAS}
            matricula={matricula}
          />
        )}
        {stage === stages.REMEDIOS && (
          <DeficiencyAndRemedyComponent
            type={types.REMEDIOS}
            matricula={matricula}
          />
        )}
      </Content>
      {matricula && (
        <SideContent>
          {Object.keys(stages).map((key) => (
            <button
              key={key}
              className={stages[key] === stage ? 'active' : ''}
              type="button"
              onClick={() => setStage(stages[key])}
            >
              {stages[key]}
            </button>
          ))}
        </SideContent>
      )}
    </Wrapper>
  )
}

export default Student
