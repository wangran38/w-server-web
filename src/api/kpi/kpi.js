import request from '@/utils/request'

export function getlist(params) {
  return request({
    url: '/admin/kpilist',
    method: 'post',
    data: params
  })
}

export function add(params) {
  return request({
    url: '/admin/addkpi',
    method: 'post',
    data: params
  })
}

export function getoptions(params) {
  return request({
    url: '/admin/treekpi',
    method: 'post',
    data: params
  })
}

export function edit(params) {
  return request({
    url: '/admin/editkpi',
    method: 'post',
    data: params
  })
}

export function del(params) {
  return request({
    url: '/admin/delkpi',
    method: 'post',
    data: params
  })
}