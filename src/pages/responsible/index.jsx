import { useEffect, useState } from 'react'

import ResponsibleComponent from 'components/responsible'
import AddressComponent, { addressTypes } from 'components/address'
import { Wrapper, Content, SideContent } from 'pages/student/styles'

const stages = {
  CADASTRO_DE_RESPONSAVEL: 'Cadastro de responsável',
  ENDERECOS: 'Endereços',
}

const Responsible = () => {
  const [codigoResponsavel, setCodigoResponsavel] = useState(0)
  const [stage, setStage] = useState(stages.CADASTRO_DE_RESPONSAVEL)

  useEffect(() => setCodigoResponsavel(0), [])
  return (
    <Wrapper>
      <Content>
        {stage === stages.CADASTRO_DE_RESPONSAVEL && (
          <ResponsibleComponent
            codigoResponsavel={codigoResponsavel}
            setCodigoResponsavel={setCodigoResponsavel}
          />
        )}
        {stage === stages.ENDERECOS && (
          <AddressComponent
            alunoOuResponsavel={{
              id: codigoResponsavel,
              type: addressTypes.RESPONSIBLE,
            }}
          />
        )}
      </Content>
      {codigoResponsavel !== 0 && (
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

export default Responsible
