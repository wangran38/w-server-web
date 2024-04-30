import request from '@/utils/request'

export function getlist(params) {
  return request({
    url: '/admin/getbooklist',
    method: 'post',
    data: params
  })
}

export function add(params) {
  return request({
    url: '/admin/addbook',
    method: 'post',
    data: params
  })
}

export function getoptions(params) {
  return request({
    url: '/admin/treebook',
    method: 'post',
    data: params
  })
}

export function edit(params) {
  return request({
    url: '/admin/editbook',
    method: 'post',
    data: params
  })
}

export function del(params) {
  return request({
    url: '/admin/delbook',
    method: 'post',
    data: params
  })
}
