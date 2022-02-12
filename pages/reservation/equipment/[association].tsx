import { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import { useRouter } from 'next/router'
import { Grid } from 'semantic-ui-react'

import Layout from '../../../components/layout'
import ReservationCalendar
  from '../../../components/reservation/reservation.calendar'
import EquipReservationTable
  from '../../../components/reservation/equip.reservation.table'
import EquipListTable from '../../../components/reservation/equip.list.table'

type equipmentType = {
  name: string,
  description: string,
  fee: number,
  imageName: string
};

type ObjectType = {
  [key: string]: string
}

const ownerName: ObjectType = {
  'dongyeon': '동아리연합회',
  'dorm-union': '생활관자치회',
  'saengna': '생각나눔',
}

const ownerLocation: ObjectType = {
  'dongyeon': '동아리연합회 사무실(학생회관 301호)',
  'dorm-union': '생활관자치회 사무실(생활관 4동)',
  'saengna': '생각나눔 사무실(학생회관 108호)',
}

const EquipAssociation: React.FunctionComponent = (props) => {
  const router = useRouter()
  const associationName = router.query.association as string

  const [selectedDate, setDate] = useState(
    moment(new Date()).format('YYYYMMDD'))
  const [userInfo, setUserInfo] = useState()
  const [equipments, setEquipments] = useState<equipmentType[]>([])

  const associationKorName = ownerName[associationName];
  const associationLocation = ownerLocation[associationName];

  useEffect(() => {
    if (!associationName) return

    axios.get(`${process.env.NEXT_PUBLIC_API}/auth/verifyToken`,
      { withCredentials: true }).
      then(res => setUserInfo(res.data)).
      catch(() => {})
    axios.get(`${process.env.NEXT_PUBLIC_API}/equip/owner/${associationName}`).
      then((res) => {
        setEquipments(res.data)
      })
  }, [selectedDate, associationName])

  return (
    <Layout>
      <h1>{associationKorName} - 장비 예약하기</h1>
      <Grid columns={2} divided stackable>

        <Grid.Column width={6}>
          <EquipListTable equipments={equipments}/>
          <p style={{ marginTop: '10px' }}>
            장비를 클릭하면 장비 사진을 볼 수 있습니다! 🖼️<br/>
            예약한 장비는 {associationLocation}에서 수령하실 수 있습니다. 🏢️<br/>
            장비가 분실되거나 예약 시간을 초과할 경우, 차후 예약에 제한을 둘 수 있습니다. 🚨
          </p>
        </Grid.Column>

        <Grid.Column>
          <Grid rows={2} divided stackable>
            <Grid.Column>
              <Grid.Row centered style={{ marginBottom: '1em' }}>
                <ReservationCalendar selectedDate={selectedDate}/>
              </Grid.Row>
              <Grid.Row>
                <EquipReservationTable/>
              </Grid.Row>
            </Grid.Column>
          </Grid>
        </Grid.Column>

      </Grid>
    </Layout>
  )
}

export default EquipAssociation