import { KeyboardEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Divider, Form, Modal } from 'semantic-ui-react'
import axios from 'axios'
import moment from 'moment'

import { DateInput } from 'semantic-ui-calendar-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { roundUpByDuration } from '../../lib/time-date'
import { IEquipment } from '../../types/reservation.interface'
import { IUser } from '../../types/user.interface'

type EquipReservationCreateModalProps = {
  associationName: string,
}

const EquipReservationCreateModal
  = ({ associationName }: EquipReservationCreateModalProps) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const [userInfo, setUserInfo] = useState<IUser | null>({
    name: '',
  })
  const [equipments, setEquipments] = useState<IEquipment[]>([])

  const [reservedEquips, setReservedEquips] = useState<string[]>([])
  const [phone, setPhone] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [date, setDate] = useState<string>(moment().format('YYYY-MM-DD')) // YYYY-MM-DD
  const [startTime, setStartTime]
    = useState<string>(roundUpByDuration(moment(), 30).format('HHmm')) // HHmm
  const [endTime, setEndTime]
    = useState<string>(
    roundUpByDuration(moment(), 30).add(30, 'minute').format('HHmm')) // HHmm

  useEffect(() => {
    if (!associationName) return;

    axios.get(
      `${process.env.NEXT_PUBLIC_API}/auth/verifyToken`,
      { withCredentials: true }).
      then(res => setUserInfo(res.data)).
      catch(() => setUserInfo(null))

    axios.get(`${process.env.NEXT_PUBLIC_API}/equip/owner/${associationName}`).
      then((res) => setEquipments(res.data))

  }, [associationName, router])

  function handleSubmit () {
    axios.post(`${process.env.NEXT_PUBLIC_API}/reservation-equip`, {
      equipments: reservedEquips,
      owner: associationName,
      phone: phone,
      title: title,
      description: description,
      date: moment(date).format('YYYYMMDD'), // YYYYMMDD
      start_time: startTime, // HHmm
      end_time: endTime, // HHmm
    }, { withCredentials: true })
      .then(() => {
        alert('????????? ??????????????????!');
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        alert('?????? ????????? ??????????????????.')
    })
  }

  return (
    <Modal
      closeIcon
      size={"small"}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => {
        if (userInfo) {
          setOpen(true)
        } else {
          alert('????????? ??? ????????? ??? ????????????.')
          router.push('/auth/login')
        }
      }}
      trigger={<Button primary>?????? ????????????</Button>}
    >
      <Modal.Header>?????? ?????? ??????</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input
            required readOnly label={'?????????'}
            value={userInfo ? userInfo.name : ''}/>

          <Form.Input
            required label={'????????????'}
            placeholder={'010-xxxx-xxxx'}
            onChange={e => setPhone(e.target.value)}/>
          <Form.Input
            required label={'?????? ??????'}
            placeholder={'?????? ????????? ??????????????????.'}
            onChange={e => setTitle(e.target.value)}/>
          <Form.TextArea
            required label={'??????'}
            placeholder={'???????????? ????????? ?????? ????????????.'}
            onChange={e => setDescription(e.target.value)}/>

          <Divider/>

          <Form.Dropdown
            required fluid multiple search selection
            label={'?????? ??????'}
            placeholder={'????????? ???????????? ??????????????????.'}
            options={equipments.map((equip, idx) => ({
              key: idx,
              text: equip.name,
              value: equip.uuid,
            }))}
            onKeyDown={(e: KeyboardEvent) => e.preventDefault()}
            // @ts-ignore
            onChange={(e, {value}) => setReservedEquips(value)}
          />

          <Form.Group>
            <div className={'required field'}>
              <label>??????</label>
              <DateInput
                dateFormat={'yyyy-MM-DD'}
                minDate={moment()} maxDate={moment().add(30, 'day')}
                // @ts-ignore
                value={date}
                onKeyDown={(e: KeyboardEvent) => e.preventDefault()}
                onChange={(_, value) => {
                  const targetDate: string = value.value // YYYY-MM-DD
                  const todayDate: string = moment().format('YYYY-MM-DD')
                  setDate(targetDate)
                  if (targetDate === todayDate) {
                    setStartTime(roundUpByDuration(moment(), 30).format('HHmm'))
                    setEndTime(
                      roundUpByDuration(moment(), 30).
                        add(30, 'minute').
                        format('HHmm'))
                  } else {
                    setStartTime('0000')
                    setEndTime('0030')
                  }
                }}/>
            </div>

            <div className={'required field'}>
              <label>?????? ??????</label>
              <DatePicker
                showTimeSelect showTimeSelectOnly timeIntervals={30}
                dateFormat={'hh:mm aa'}
                selected={moment(startTime, 'HHmm').toDate()}
                minTime={
                  (moment().format('YYYY-MM-DD') === date) ?
                    moment().toDate() :
                    moment().startOf('day').toDate()
                }
                maxTime={moment().endOf('day').toDate()}
                onKeyDown={e => e.preventDefault()}
                onChange={(startTime: Date) => {
                  setStartTime(moment(startTime).format('HHmm'))
                  setEndTime(moment(startTime).add(30, 'minute').format('HHmm'))
                }}/>
            </div>

            <div className={'required field'}>
              <label>?????? ??????</label>
              <DatePicker
                showTimeSelect showTimeSelectOnly timeIntervals={30}
                dateFormat={'hh:mm aa'}
                selected={moment(endTime, 'HHmm').toDate()}
                minTime={moment(startTime).add(30, 'minute').toDate()}
                maxTime={moment().endOf('day').toDate()}
                onKeyDown={e => e.preventDefault()}
                onChange={(endTime: Date) => {
                  setEndTime(moment(endTime).format('HHmm'))
                }}/>
            </div>
          </Form.Group>

          <Form.Button onClick={handleSubmit}>
            ??????
          </Form.Button>

        </Form>
      </Modal.Content>
    </Modal>
  )
}

export default EquipReservationCreateModal